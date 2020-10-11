import React, { useEffect, useRef } from 'react';
import { useSelector } from 'dva';
import { initMap, LngLat } from '@/utils/leafletMap';
import styles from './index.less';

export default function() {
  const mapRef = useRef(null);
  const polylineLayer = useRef();
  const polylineDotLayer = useRef();
  const polylineArrowLayer = useRef();
  useEffect(() => {
    mapRef.current = initMap('vehicleFileMap');
    polylineLayer.current = L.polyline([], {
      color: '#4751f1',
      weight: 10,
    }).addTo(mapRef.current);
    polylineDotLayer.current = L.featureGroup().addTo(mapRef.current);
    polylineArrowLayer.current = L.layerGroup().addTo(mapRef.current);
    // eslint-disable-next-line
  }, []);

  const { track } = useSelector(({ vehicleFile }) => vehicleFile);

  /**
   * 把轨迹添加到地图
   */
  useEffect(() => {
    if (!mapRef.current || track.length === 0) return;

    const lnglats = track
      .map((item) => LngLat(item.lnglat.lng, item.lnglat.lat))
      .filter((lnglat) => lnglat.lng && lnglat.lat);
    mapRef.current.fitBounds(lnglats);
    // 设置轨迹点位
    polylineLayer.current.setLatLngs(lnglats);
    // 设置轨迹箭头
    polylineArrowLayer.current.addLayer(
      L.polylineDecorator(polylineLayer.current, {
        patterns: [
          {
            repeat: 20,
            symbol: L.Symbol.arrowHead({
              pixelSize: 6,
              polygon: false,
              pathOptions: { color: '#fff', weight: 2, opacity: 0.65, stroke: true },
            }),
          },
        ],
      }),
    );
    lnglats.forEach((lnglat) => {
      polylineDotLayer.current.addLayer(
        L.marker(lnglat, {
          icon: L.divIcon({
            html: `<div class="f-circle-marker"></div>`,
            className: '',
            iconSize: [4, 4],
            iconAnchor: [2, 2],
          }),
          // radius: 10,
          // color: '#fff',
          // weight: 2,
          // fillColor: '#1890ff',
          // fillOpacity: 1,
          // renderer: L.svg(),
          // attribution: i + 1
        }),
      );
    });
    return () => {
      // 清除轨迹
      polylineLayer.current.setLatLngs([]);
      polylineArrowLayer.current.clearLayers();
      polylineDotLayer.current.clearLayers();
    }
  }, [track]);

  return <div className={styles.map} id="vehicleFileMap" />;
}
