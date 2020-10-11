import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import { Select, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import cx from 'classnames';
import { initMap } from '@/utils/leafletMap';
import Aliplayer from '@/components/Aliplayer';
// import playIcon from '@/assets/black-32.png';
import styles from './index.less';

const { Option } = Select;

export default function() {
  const mapRef = useRef(null);
  const markerLayer = useRef();
  const selectedMarkerLayer = useRef();
  const clusterGroupLayer = useRef();
  const [isShowplayer, setIsShowplayer] = useState(false);
  const [playId, setPlayId] = useState('');
  const { cameraList } = useSelector(({ videoModal }) => videoModal);

  useEffect(() => {
    mapRef.current = initMap('cameraMap');
    markerLayer.current = L.featureGroup();
    selectedMarkerLayer.current = L.featureGroup().addTo(mapRef.current);
    markerLayer.current.on('click', (e) => {
      setIsShowplayer(true);
      const { id } = e.layer.options;
      setPlayId(id);
    });
    clusterGroupLayer.current = L.markerClusterGroup({
      zoomToBoundsOnClick: false,
      maxClusterRadius: (zoom) => (zoom === 18 ? 1 : 80),
    }).addTo(mapRef.current);
  }, []);

  useEffect(() => {
    cameraList.forEach((i) => {
      const { crossing } = i;
      const className = cx('map-camera-marker', {
        hide: !crossing,
      });
      markerLayer.current.addLayer(
        L.marker([i.gdWd, i.gdJd], {
          icon: L.divIcon({
            html: `<div class="map-camera"><div class="${className}">${crossing}</div></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 28],
          }),
          title: i.azdd,
          id: i.spbfbm,
        }),
      );
    });
    mapRef.current.fitBounds(cameraList.map((i) => ({ lng: Number(i.gdJd), lat: Number(i.gdWd) })));
    clusterGroupLayer.current.addLayer(markerLayer.current);
    return () => {
      markerLayer.current.clearLayers();
      clusterGroupLayer.current.clearLayers();
    };
  }, [cameraList]);

  const onChange = (value) => {
    selectedMarkerLayer.current.clearLayers();
    if (value) {
      const selectedCamera = cameraList.filter((item) => item.spbfbm === value);
      mapRef.current.fitBounds([
        { lng: Number(selectedCamera[0].gdJd), lat: Number(selectedCamera[0].gdWd) },
      ]);
      selectedMarkerLayer.current.addLayer(
        L.marker([Number(selectedCamera[0].gdWd), Number(selectedCamera[0].gdJd)], {
          icon: L.divIcon({
            html: `<div class="f-shadow-marker"></div>`,
            className: '',
            iconSize: [8, 8],
            iconAnchor: [2, 2],
          }),
        }),
      );
    }
  };

  return (
    <div className={styles.wrap}>
      <div id="cameraMap" className={styles.mapWrapper} />
      <div className={styles.searchWrap}>
        <div className={styles.title}>摄像头</div>
        <Select
          showSearch
          allowClear
          style={{ width: 340 }}
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {cameraList.map((item, index) => (
            <Option
              value={item.spbfbm}
              title={`${item.spbfbm}(${item.azdd})`}
              key={index}
            >{item.azdd}</Option>
          ))}
        </Select>
      </div>
      <Modal
        width={800}
        bodyStyle={{ height: 600 }}
        visible={isShowplayer}
        closable={false}
        footer={null}
        wrapClassName={styles.modelWrap}
      >
        <div
          className={styles.closeIcon}
          onClick={() => {
            setIsShowplayer(false);
            setPlayId('');
          }}
        >
          <CloseOutlined />
        </div>
        <Aliplayer id={playId} cameraId={playId} selectTime={[]} />
      </Modal>
    </div>
  );
}
