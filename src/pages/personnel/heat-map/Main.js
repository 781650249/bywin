import React, { useRef, useEffect } from 'react';
import { initMap, LngLat } from '@/utils/leafletMap';
import { useSelector, useDispatch } from 'dva';
import { Spin } from 'antd';
import styles from './index.less';

export default function({ loading }) {
  const { statisticsCount } = useSelector(({ heatMap }) => heatMap);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const heatLayer = useRef(L.heatLayer([], { radius: 50 }));
  const markerLayer = useRef(L.featureGroup());
  useEffect(() => {
    mapRef.current = initMap('heatMap', {
      zoom: 15,
      center: LngLat(119.48, 25.55),
    });
    markerLayer.current.addTo(mapRef.current);
    heatLayer.current.addTo(mapRef.current);
  }, []);

  useEffect(() => {
    heatLayer.current.redraw();

    if (Array.isArray(statisticsCount) && mapRef.current && statisticsCount.length > 0) {
      heatLayer.current.addTo(mapRef.current);
      statisticsCount.forEach((el) => {
        heatLayer.current.addLatLng(LngLat(el.longitude, el.latitude), el.count / 100);
        markerLayer.current.addLayer(
          L.marker([el.latitude, el.longitude], {
            icon: L.divIcon({
              // html: `<div class="map-camera"></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 28],
            }),
            title: `${el.address} 人员总数:${el.count}`,
          }),
        );
      });
    } else {
      mapRef.current.removeLayer(heatLayer.current);
    }
  }, [dispatch, statisticsCount]);

  return (
    <>
      {/* <div className={styles.picExplain}>
        <div className={styles.txt}>图例说明</div>
        <div className={styles.pink} />
        <div className={styles.purple} />
        <div className={styles.blue} />
        <div className={styles.green} />
        <div className={styles.yellow} />
        <div className={styles.red} />
      </div> */}
      <Spin spinning={loading} wrapperClassName={styles.spin}>
        <div className={styles.map} id="heatMap" />
      </Spin>
    </>
  );
}
