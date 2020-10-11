import React, { useState, useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
import { SettingOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { router } from 'umi';
import { Viewer } from '@/components';
import { initMap, LngLat } from '@/utils/leafletMap';
import { getPrewarningList } from '@/services/around-prevention';
import cameraIcon from './images/camera.png';
import styles from './index.less';

const { RangePicker } = DatePicker;

export default function() {
  const mapRef = useRef(null);
  const polygonLayerRef = useRef(new L.LayerGroup());
  const markerLayerRef = useRef(new L.LayerGroup());

  const { communityList } = useSelector((state) => state.global);

  const [prewarningList, setPrewarningList] = useState([]);
  const [beginTime, setBeginTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    mapRef.current = initMap('aroundPreventionMap', {
      editable: true,
      editOptions: {
        skipMiddleMarkers: true,
      },
    });
    polygonLayerRef.current.addTo(mapRef.current);
    markerLayerRef.current.addTo(mapRef.current);
  }, []);

  /**
   * 获取预警记录
   */
  useEffect(() => {
    const getData = async () => {
      const res = await getPrewarningList({ page: 1, pageSize: 1000, beginTime, endTime });
      setPrewarningList(res.rows);
      res.rows.forEach((item) => {
        markerLayerRef.current.addLayer(
          L.marker(LngLat(item.lng, item.lat), {
            icon: L.icon({
              iconUrl: cameraIcon,
              iconSize: [29, 32],
              iconAnchor: [15, 28],
            }),
            title: `${item.modelName} ${item.warningSite}`,
          }),
        );
      });
    };
    getData();
  }, [beginTime, endTime]);

  /**
   * 加载园区区域
   */
  useEffect(() => {
    if (!mapRef.current) return;
    if (communityList.length === 0) return;
    const { current: polygonLayer } = polygonLayerRef;
    communityList.forEach((item, i) => {
      const path = item.communityRangeVO.map((lnglat) => LngLat(lnglat.lng, lnglat.lat));
      const polygon = L.polygon(path, {
        color: '#4751f1',
        weight: 3,
        fillOpacity: 0,
        renderer: L.svg(),
        className: styles.polygon,
      });
      polygonLayer.addLayer(polygon);
      if (i === 0) {
        mapRef.current.fitBounds(path);
      }
    });
  }, [communityList]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.mapContainer}>
        <h2 className={styles.title}>周边防范</h2>
        <div className={styles.map} id="aroundPreventionMap" />
        <div className={styles.setting} onClick={() => router.push('/around-prevention/setting')}>
          <SettingOutlined />
        </div>
      </div>
      <div className={styles.prewarningContainer}>
        <h2 className={styles.title}>预警记录</h2>
        <div className={styles.searchForm}>
          <RangePicker
            style={{ width: '100%' }}
            allowClear
            showTime={{ format: 'HH:mm' }}
            onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                setBeginTime(value[0].format('YYYY-MM-DD HH:mm:ss'));
                setEndTime(value[1].format('YYYY-MM-DD HH:mm:ss'));
              } else {
                setBeginTime(null);
                setEndTime(null);
              }
            }}
          />
        </div>
        <div className={styles.list}>
          {prewarningList.map((item, i) => (
            <div className={styles.listItem} key={i}>
              <div
                className={styles.listItemPicture}
                onClick={() => setCurrentImage(item.warningImage)}
              >
                <img src={item.warningImage} alt="" loading="lazy" />
              </div>
              <div className={styles.listItemContent}>
                <div className={styles.listItemTitle}>{item.modelName}</div>
                <div className={styles.listItemTime}>
                  <ClockCircleOutlined className="mr-8" />
                  {item.warningDate}
                </div>
                <div className={styles.listItemAddress}>
                  <EnvironmentOutlined className="mr-8" />
                  {item.warningSite}
                </div>
              </div>
            </div>
          ))}
          <Viewer image={currentImage} onClose={() => setCurrentImage(null)} />
        </div>
      </div>
    </div>
  );
}
