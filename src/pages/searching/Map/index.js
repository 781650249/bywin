import React from 'react';
import { connect } from 'dva';
import cx from 'classnames';
// import moment from 'moment';
import { isEqual, cloneDeep } from 'lodash';
import { Menu } from 'antd';
import Aliplayer from '@/components/previous/aliplayer';
import { mapOptions } from '@/config';
import { initMap, LngLat } from '@/utils/leafletMap';
import IMAGE from '../components/image';
import { colors } from '../config';
import styles from './index.less';

const { L } = window;

@connect(({ searchPanel, searchingMap }) => {
  const { selectedResult, currentKey, multSelectedResult, currentPoint } = searchPanel;
  const {
    cameraList,
    cameraIdList,
    cameraTypeList,
    policeStationList,
    selectedCameraType,
    selectedPoliceStation,
  } = searchingMap;
  return {
    selectedResult,
    currentKey,
    multSelectedResult,
    currentPoint,
    cameraList,
    cameraIdList,
    cameraTypeList,
    policeStationList,
    selectedCameraType,
    selectedPoliceStation,
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
      const cameraLayer = e.layer;
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
              cameraId: cameraLayer.options.id,
            });
          },
        );
        // console.log(cameraLayer.getLatLng(), cameraLayer.options.title)
      }
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
    const { cameraList, selectedCameraType, selectedPoliceStation, selectedResult } = this.props;
    // 判断是否已有摄像头数据
    if (selectedCameraType.length > 0 && selectedPoliceStation.length > 0) {
      if (cameraList.length > 0 && this.markersLayer.getLayers().length === 0) {
        this.addMarkerToMap(cameraList);
      } else {
        this.fetchCameraList();
      }
    }

    // 判断已有选中图片且地图没有渲染
    if (selectedResult.length > 0 && this.labels.length === 0) {
      this.setPolylinePath();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      cameraList,
      cameraTypeList,
      policeStationList,
      selectedCameraType,
      selectedPoliceStation,
      selectedResult,
      multSelectedResult,
      currentPoint,
    } = this.props;
    // 摄像头变更时重新标记点位
    if (!isEqual(cameraList, prevProps.cameraList)) {
      this.addMarkerToMap(cameraList);
    }

    if (cameraList.length === 0 && prevProps.cameraList.length !== 0) {
      // this.map.remove(this.polygons);
      // this.polygons = [];
      // this.clearOrSelectAll(false);
      this.fetchCameraList();
    }
    // 摄像头类型或派出所变更时重新请求摄像头
    if (
      cameraTypeList.length > 0 &&
      policeStationList.length > 0 &&
      (!isEqual(selectedCameraType, prevProps.selectedCameraType) ||
        !isEqual(selectedPoliceStation, prevProps.selectedPoliceStation))
    ) {
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
    if (
      (Object.keys(prevProps.multSelectedResult).length > 0 ||
        prevProps.selectedResult.length > 0) &&
      Object.keys(multSelectedResult).length === 0 &&
      selectedResult.length === 0
    ) {
      this.polylineLayer.clearLayers();
      this.arrowLayer.clearLayers();
      this.labelsLayer.clearLayers();
    }
  }

  fetchCameraList = () => {
    const {
      dispatch,
      cameraTypeList,
      policeStationList,
      selectedCameraType,
      selectedPoliceStation,
    } = this.props;

    let cameraType;
    let gxdwmcs;
    if (selectedCameraType.length === 0 || selectedPoliceStation.length === 0) {
      dispatch({
        type: 'searchingMap/setState',
        payload: {
          cameraList: [],
          cameraIdList: [],
        },
      });
      return;
    }
    if (selectedCameraType.length !== cameraTypeList.length) {
      cameraType = selectedCameraType.join(',');
    }
    if (selectedPoliceStation.length !== policeStationList.length) {
      gxdwmcs = selectedPoliceStation.join(',');
    }
    dispatch({
      type: 'searchingMap/getCameraList',
      payload: {
        startTime: ':00',
        stopTime: ':00',
        cameraType,
        gxdwmcs,
      },
    });
  };

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

    // 把图层组添加到地图
    this.polylineLayer.addTo(this.map);
    this.arrowLayer.addTo(this.map);
    this.labelsLayer.addTo(this.map);
    this.polygonLayer.addTo(this.map);
    const { center } = mapOptions;
    this.polyline = L.polyline([], {
      color: '#FF5029',
      weight: 6,
    });
    this.latestMarker = L.marker(LngLat(center.lng, center.lat), {
      icon: L.icon({
        iconUrl: IMAGE.KEY_PERSON_RED_30,
        iconSize: [30, 30],
        iconAnchor: L.point(15, 27),
      }),
      zIndexOffset: 1200,
      opacity: 0,
    }).addTo(this.map);

    // 右键菜单
    this.addContextMenu();

    // 多边形框选完成事件
    this.map.on('editable:drawing:commit', (e) => {
      e.layer.disableEdit();
      this.isMarkersInPolygons();
    });
  };

  /**
   * 重置地图
   */
  resetMap = () => {
    this.stopDraw();
    this.clearOrSelectAll();
    this.latestMarker.setOpacity(0);
    this.polylineLayer.clearLayers();
    this.labelsLayer.clearLayers();
    this.map.setView(mapOptions.center, 14);
  };

  /**
   * 添加右键菜单
   */
  addContextMenu = () => {
    const mapNode = document.getElementById('searchingMap');
    mapNode.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const { top, left } = mapNode.getBoundingClientRect();
      const { current } = this.menu;
      current.style.display = 'block';
      current.style.top = `${e.clientY - top}px`;
      current.style.left = `${e.clientX - left}px`;
    });
    mapNode.addEventListener('click', (e) => {
      e.preventDefault();
      const { current } = this.menu;
      current.style.display = 'none';
    });
  };

  /**
   * 右键菜单点击事件
   */
  handleMenuClick = ({ key }) => {
    const { dispatch, cameraList } = this.props;
    switch (key) {
      case 'select':
        this.startDrawPolygon();
        if (this.polygonLayer.getLayers().length === 0) {
          this.clearOrSelectAll(false);
        }
        break;
      case 'all':
        dispatch({
          type: 'searchingMap/setState',
          payload: {
            cameraIdList: cameraList.map((v) => v.spbfbm),
            drawing: false,
          },
        });
        this.stopDraw();
        this.clearOrSelectAll();
        break;
      case 'clear':
        this.stopDraw();
        this.clearOrSelectAll(false);
        break;
      default:
        break;
    }
    const { current } = this.menu;
    current.style.display = 'none';
  };

  /**
   * 启动多连形框选
   */
  startDrawPolygon = () => {
    this.map.editTools.startPolygon();
  };

  /**
   * 停用鼠标绘制组件并清除已绘制图层
   */
  stopDraw = () => {
    this.map.editTools.stopDrawing();
    this.polygonLayer.clearLayers();
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
        iconUrl = IMAGE.CAMERA_SELECTED;
        break;
      case 'unselected':
        if (this.offline.includes(id)) {
          iconUrl = IMAGE.OFFLINE;
        } else {
          iconUrl = IMAGE.CAMERA_UNSELECTED_WHITE;
        }
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
    const { dispatch, cameraList } = this.props;
    let cameraIdList = [];
    let status = 'unselected';
    if (selected) {
      status = 'selected';
      cameraIdList = cameraList.map((camera) => camera.spbfbm);
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
    dispatch({
      type: 'searchingMap/setState',
      payload: {
        cameraIdList,
      },
    });
  };

  /**
   * 判断摄像头是否在框选区域内
   * @param layer 多边形图层
   */
  isMarkersInPolygons = () => {
    const markers = this.markersLayer.getLayers();
    const { dispatch } = this.props;
    const cameraIdList = [];
    const selectedMarkers = [];
    const unselectedMarkers = [];
    markers.forEach((marker) => {
      const layers = this.polygonLayer.getLayers();
      const bool =
        layers.findIndex((layer) => {
          const gjLayer = L.geoJson(layer.toGeoJSON());
          const results = window.leafletPip.pointInLayer(marker.getLatLng(), gjLayer, true);
          return results.length > 0;
        }) !== -1;
      if (bool) {
        cameraIdList.push(marker.options.id);
        selectedMarkers.push(marker);
        this.setMarkerIcon(marker, 'selected');
      } else {
        unselectedMarkers.push(marker);
        this.setMarkerIcon(marker, 'unselected');
      }
    });

    if (selectedMarkers.length > 0) {
      this.selectedMarkersLayer = L.featureGroup(selectedMarkers);
    }
    if (unselectedMarkers.length > 0) {
      this.unselectedMarkersLayer = L.featureGroup(unselectedMarkers);
    }
    this.setMarkerCluster();
    dispatch({
      type: 'searchingMap/setState',
      payload: {
        cameraIdList,
      },
    });
  };

  /**
   * 摄像头聚合
   */
  setMarkerCluster = () => {
    if (this.markersLayer.getLayers().length === 0) {
      return;
    }
    // 聚合图标函数
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
        iconUrl = IMAGE.OFFLINE;
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
    } else {
      this.isMarkersInPolygons();
    }
  };

  /**
   * 关闭视频
   */
  vedioClose = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 截图
   */
  snapshoted = (img) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pictureUpload/setState',
      payload: {
        cropperVisible: true,
        image: img,
      },
    });
    // 截图后关闭视频
    this.vedioClose();
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
        <div className={styles.menu} ref={this.menu}>
          <Menu selectable={false} onClick={this.handleMenuClick}>
            <Menu.Item key="select">框选</Menu.Item>
            <Menu.Item key="all">全选</Menu.Item>
            <Menu.Item key="clear">删除框选</Menu.Item>
          </Menu>
        </div>
        <Aliplayer
          playFormat="flv"
          visible={visible}
          cameraId={cameraId}
          close={this.vedioClose}
          snapshoted={this.snapshoted}
        />
      </div>
    );
  }
}

export default LeafletMap;
