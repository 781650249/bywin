import React from 'react';
import { connect } from 'dva';
import cx from 'classnames';
import { isEqual, cloneDeep } from 'lodash';
import Aliplayer from '@/components/previous/aliplayer';
import { initMap, LngLat } from '@/utils/leafletMap';
import IMAGE from '../components/image';
import { colors } from '../config';
import styles from './index.less';

const { L } = window;

@connect(({ relaTimeProtection }) => {
  const { cameraList, selectedCameraKeys } = relaTimeProtection;
  return {
    cameraList,
    selectedCameraKeys,
  };
})
class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.menu = React.createRef();
    // 控件
    this.drawPolygon = null;

    // 图层
    this.markersLayer = L.featureGroup();
    this.markersLayer.on('click', (e) => {
      this.markersLayer.getLayers().forEach((marker) => {
        this.setMarkerIcon(marker, 'selected');
      });
      const cameraLayer = e.layer;
      const filterItem = [e.layer.options];
      if (!this.map.editTools.drawing()) {
        // 视频播放
        // eslint-disable-next-line no-console
        this.setState(
          {
            visible: false,
          },
          () => {
            this.setState({
              visible: true,
              cameraId: filterItem.filter((item) => item.id),
            });
            const markers = this.markersLayer.getLayers();
            markers
              .filter((i) => i.options.id === cameraLayer.options.id)
              .forEach((marker) => {
                this.setMarkerIcon(marker, 'playing');
              });
          },
        );
      }
      const { dispatch } = this.props;
      const { cameraId } = this.state;
      dispatch({
        type: 'relaTimeProtection/setState',
        payload: {
          selectedCameraKeys: cameraId,
        },
      });
    });
    this.selectedMarkersLayer = null;
    this.unselectedMarkersLayer = null;
    this.selectedMarkerCluster = null;
    this.unselectedMarkerCluster = null;

    this.latestMarker = null;

    // 轨迹
    this.polyline = null;
    this.multPolyline = {};

    // 轨迹点位标签
    this.labels = [];
    this.multLabels = {};

    this.multArrow = {};

    // 图层组
    this.polygonLayer = new L.LayerGroup();
    this.polylineLayer = new L.LayerGroup();
    this.arrowLayer = new L.LayerGroup();
    this.labelsLayer = new L.LayerGroup();

    // 离线摄像头id数组
    this.offline = [];
    this.state = {
      visible: false,
      cameraId: '',
    };
  }

  componentDidMount() {
    this.initMap();
    const { cameraList } = this.props;
    this.addMarkerToMap(cameraList);
    this.map.setView({ lat: 25.5, lng: 119.4 }, 10);
  }

  componentDidUpdate(prevProps) {
    const { cameraList, selectedResult, currentPoint, lnglats } = this.props;
    if (lnglats.length > 0) {
      this.map.setView(...lnglats, 1000);
    } else {
      return;
    }
    if (!isEqual(cameraList, prevProps.cameraList)) {
      this.addMarkerToMap(cameraList);
    }

    if (cameraList.length === 0 && prevProps.cameraList.length !== 0) {
      this.fetchCameraList();
    }
    // 选中目标或取消选中目标时执行，渲染对应的轨迹和标签
    if (!isEqual(selectedResult, prevProps.selectedResult)) {
      this.setPolylinePath();
      const { lat, lng } = currentPoint;
      if (lat && lng && !isEqual(currentPoint, prevProps.currentPoint)) {
        this.map.panTo([lat, lng]);
      }
    }
  }

  /**
   * 初始化地图
   */
  initMap = () => {
    this.map = initMap('searchingMap', {
      editable: true,
      editOptions: {
        skipMiddleMarkers: true,
        featuresLayer: this.polygonLayer,
      },
    });
  };

  getMarkerHtml = (iconUrl, crossing) => {
    const className = cx('map-camera-marker', {
      hide: !crossing,
    });
    return `
      <div class="map-camera" style="background-image: url(${iconUrl})">
        <div class="${className}">${crossing}</div>
      </div>
    `;
  };

  /**
   * 设置摄像头图标
   */
  setMarkerIcon = (marker, status) => {
    const { id, crossing } = marker.options;
    let iconUrl = '';
    switch (status) {
      case 'selected':
        iconUrl = IMAGE.BLACK_SELECTED_32;
        break;
      case 'unselected':
        if (this.offline.includes(id)) {
          iconUrl = IMAGE.CAMERA_UNSELECTED_WHITE;
        } else {
          iconUrl = IMAGE.CAMERA_UNSELECTED_WHITE;
        }
        iconUrl = IMAGE.CAMERA_UNSELECTED_WHITE;
        break;
      case 'playing':
        iconUrl = IMAGE.CAMERA_UNSELECTED_WHITE;
        break;
      default:
        if (id) break;
    }
    marker.setIcon(
      L.divIcon({
        html: this.getMarkerHtml(iconUrl, crossing),
        iconSize: [32, 32],
        iconAnchor: [16, 27],
      }),
    );
  };

  /**
   * 清除或全选
   */
  clearOrSelectAll = (selected = true) => {
    if (this.markersLayer.getLayers().length === 0) return;
    let status = 'unselected';
    if (selected) {
      status = 'selected';
      this.selectedMarkersLayer = this.markersLayer;
      this.unselectedMarkersLayer = null;
    } else {
      this.unselectedMarkersLayer = this.markersLayer;
      this.selectedMarkersLayer = null;
    }
    const markers = this.markersLayer.getLayers();
    markers.forEach((marker) => {
      this.setMarkerIcon(marker, status);
    });
    this.setMarkerCluster();
  };

  /**
   * 摄像头聚合
   */
  setMarkerCluster = () => {
    if (this.markersLayer.getLayers().length === 0) {
      return;
    }
    //   // 聚合图标函数
    const iconCreateFunction = (cluster, color, backgroundImage) => {
      const count = cluster.getChildCount();
      const iconSize = [String(count).length * 20 + 20, String(count).length * 20 + 20];
      const html = `
        <i
          class="${styles.clusterIcon}"
          style="color: ${color}; background: url(${backgroundImage})"
        >
          ${cluster.getChildCount()}
        </i>
      `;
      return L.divIcon({
        html,
        iconSize,
      });
    };
    if (this.selectedMarkerCluster) {
      this.selectedMarkerCluster.clearLayers();
      this.selectedMarkerCluster = null;
    }
    if (this.unselectedMarkerCluster) {
      this.unselectedMarkerCluster.clearLayers();
      this.unselectedMarkerCluster = null;
    }
    if (this.selectedMarkersLayer) {
      this.selectedMarkerCluster = L.markerClusterGroup({
        zoomToBoundsOnClick: false,
        maxClusterRadius: (zoom) => (zoom === 18 ? 1 : 80),
        iconCreateFunction: (cluster) => iconCreateFunction(cluster, '#fff', IMAGE.GROUP_SELECTED),
      })
        .addLayer(this.selectedMarkersLayer)
        .addTo(this.map);
    }

    if (this.unselectedMarkersLayer) {
      this.unselectedMarkerCluster = L.markerClusterGroup({
        zoomToBoundsOnClick: false,
        maxClusterRadius: (zoom) => (zoom === 18 ? 1 : 80),
        iconCreateFunction: (cluster) =>
          iconCreateFunction(cluster, '#1890ff', IMAGE.GROUP_UNSELECTED_WHITE),
      })
        .addLayer(this.unselectedMarkersLayer)
        .addTo(this.map);
    }
  };

  /**
   * 把摄像头添加到地图
   */
  addMarkerToMap = (cameraList) => {
    this.markersLayer.clearLayers();
    if (this.selectedMarkersLayer) {
      this.selectedMarkersLayer = null;
    }
    if (this.unselectedMarkersLayer) {
      this.unselectedMarkersLayer = null;
    }
    if (cameraList.length === 0) return;
    const lnglats = [];
    this.offline = [];
    // 遍历并渲染摄像头
    cameraList.forEach((camera) => {
      const {
        gdJd: lng,
        gdWd: lat,
        spbfbm,
        azdd: title,
        isOnline,
        actualStatus,
        crossing,
      } = camera;

      let iconUrl = IMAGE.CAMERA_UNSELECTED_WHITE;
      // 区分离线摄像头
      if (isOnline !== 1 && actualStatus !== 'RUNNING') {
        iconUrl = IMAGE.CAMERA_UNSELECTED_WHITE;
        this.offline.push(spbfbm);
      }
      const lnglat = LngLat(lng, lat);
      // 构建marker并添加到markers数组中
      lnglats.push(lnglat);
      const marker = L.marker(lnglat, {
        icon: L.divIcon({
          html: this.getMarkerHtml(iconUrl, crossing),
          iconSize: [32, 32],
          iconAnchor: [16, 27],
        }),
        id: spbfbm,
        crossing,
        title,
      });
      // 将摄像头marker数组添加到图层组、集体绑定事件并设置聚合
      this.markersLayer.addLayer(marker);
    });
    this.map.fitBounds(lnglats);

    // 判断是否有框选，有则选中框内的摄像头，没有则全选
    const polygonLayers = this.polygonLayer.getLayers();
    if (polygonLayers.length === 0) {
      this.clearOrSelectAll();
    }
  };

  /**
   * 关闭视频
   */
  vedioClose = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    const markers = this.markersLayer.getLayers();
    markers.forEach((marker) => {
      this.setMarkerIcon(marker, 'selected');
    });
    dispatch({
      type: 'relaTimeProtection/setState',
      payload: {
        selectedCameraKeys: [],
      },
    });
  };

  // 设置轨迹和轨迹点位label
  setPolylinePath = () => {
    const { currentKey, selectedResult, multSelectedResult } = this.props;
    const path = [];
    // 把重复坐标的合并一起
    const merge = {};
    cloneDeep(selectedResult)
      .reverse()
      .forEach((element, index) => {
        const { lng, lat } = element;
        const lnglat = LngLat(lng, lat);
        path.push(lnglat);
        const key = JSON.stringify(lnglat);
        if (merge[key]) {
          merge[key] = `${merge[key]},${index + 1}`;
        } else {
          merge[key] = String(index + 1);
        }
      });

    this.arrowLayer.clearLayers();
    if (!currentKey) {
      this.polylineLayer.clearLayers();

      this.labelsLayer.clearLayers();
      if (Object.keys(this.multPolyline).length > 0) {
        this.multPolyline = {};
        this.multLabels = {};
      }
      if (path.length === 0) return;
      this.map.fitBounds(path);
      this.polyline.setLatLngs(path);
      this.polylineLayer.addLayer(this.polyline);
      const arrow = L.polylineDecorator(this.polyline, {
        patterns: [
          {
            repeat: 20,
            symbol: L.Symbol.arrowHead({
              pixelSize: 6,
              polygon: false,
              pathOptions: { color: '#fff', weight: 1, opacity: 0.65, stroke: true },
            }),
          },
        ],
      });
      this.arrowLayer.addLayer(arrow);
      Object.keys(merge).forEach((key) => {
        const text = merge[key];
        const label = L.marker(JSON.parse(key), {
          icon: L.divIcon({ html: '<span />' }),
          size: [0, 0],
        })
          .bindTooltip(String(text), {
            pane: 'popupPane',
            permanent: true,
            className: cx(styles.tooltip, styles.color0),
          })
          .openTooltip();
        this.labelsLayer.addLayer(label);
      });
    } else {
      const index = Object.keys(multSelectedResult).findIndex((key) => key === currentKey);
      if (!this.multPolyline[currentKey]) {
        let color = `hsl(${100 * index}, 60%, 60%)`;
        if (index < 8) {
          color = colors[index];
        }
        this.multPolyline[currentKey] = L.polyline(path, {
          color,
          weight: 6,
        });
        this.polylineLayer.addLayer(this.multPolyline[currentKey]);
        this.multLabels[currentKey] = [];
      }
      // 设置轨迹
      this.multPolyline[currentKey].setLatLngs(path);
      Object.keys(this.multPolyline).forEach((key) => {
        const arrow = L.polylineDecorator(this.multPolyline[key], {
          patterns: [
            {
              repeat: 20,
              symbol: L.Symbol.arrowHead({
                pixelSize: 6,
                polygon: false,
                pathOptions: { color: '#fff', weight: 1, opacity: 0.65, stroke: true },
              }),
            },
          ],
        });
        this.arrowLayer.addLayer(arrow);
      });

      // 判断是否已有当前同行标签 如果有就清除掉
      if (this.multLabels[currentKey]) {
        this.multLabels[currentKey].forEach((label) => {
          this.labelsLayer.removeLayer(label);
        });
        this.multLabels[currentKey] = [];
      }

      // 遍历生成标签
      Object.keys(merge).forEach((key) => {
        const text = merge[key];
        const label = L.marker(JSON.parse(key), {
          icon: L.divIcon({ html: '<span />' }),
          size: [0, 0],
        })
          .bindTooltip(String(text), {
            pane: 'popupPane',
            permanent: true,
            className: cx(styles.tooltip, styles[`color${index}`]),
          })
          .openTooltip();
        this.multLabels[currentKey].push(label);
        this.labelsLayer.addLayer(label);
      });
    }
  };

  render() {  
    const { visible, cameraId } = this.state;
    return (
      <div className="mapWrap">
        <div id="searchingMap" className={cx(styles.map)} />
        <Aliplayer
          isVolumn={1}
          title={cameraId.length > 0 && cameraId[0].title}
          playFormat="flv"
          visible={visible}
          cameraId={cameraId.length > 0 && cameraId[0].id}
          close={this.vedioClose}
          snapshoted={false}
        />
      </div>
    );
  }
}

export default LeafletMap;
