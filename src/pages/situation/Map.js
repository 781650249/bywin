import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import cx from 'classnames';
import moment from 'moment';
import { initMap, LngLat } from '@/utils/leafletMap';
import Aliplayer from '@/components/previous/aliplayer';
import styles from './index.less';

export default function() {
  const mapRef = useRef(null);
  const markersLayer = useRef(L.featureGroup());
  const clusterGroupLayer = useRef();
  const polygonLayer = useRef(L.layerGroup());
  const { range } = useSelector(({ global }) => global.communityInfo);
  const { cameraList } = useSelector(({ global }) => global);
  const [isShowplayer, setIsShowplayer] = useState(false);
  const [playId, setPlayId] = useState('');

  const addPolygonToMap = (lnglats = []) => {
    polygonLayer.current.clearLayers();
    if (lnglats.length === 0) return;
    const polygon = L.polygon(lnglats, {
      color: '#4751f1',
      weight: 3,
      fillColor: '#4751f1',
      fillOpacity: 0.05,
    });
    polygonLayer.current.addLayer(polygon);
    mapRef.current.fitBounds(lnglats, {
      paddingTopLeft: [50, 0],
      paddingBottomRight: [100, 200],
      animate: true,
    });
  };
  
  /**
   * 把摄像头添加到地图
   */
  const addMarkerToMap = (lnglats) => {
    markersLayer.current.clearLayers();
    clusterGroupLayer.current.clearLayers();
    if (lnglats.length === 0) return;
    // 遍历并渲染摄像头
    lnglats.forEach((camera) => {
      const { lng, lat, spbfbm, address, crossing } = camera;
      const lnglat = LngLat(lng, lat);
      const className = cx('map-camera-marker', {
        hide: !crossing,
      });
      const marker = L.marker(lnglat, {
        icon: L.divIcon({
          html: `<div class="map-camera"><div class="${className}">${crossing}</div></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 28],
        }),
        id: spbfbm,
        title: address,
      });
      // 将摄像头marker数组添加到图层组
      markersLayer.current.addLayer(marker);
    });
    clusterGroupLayer.current.addLayer(markersLayer.current);
    // mapRef.current.fitBounds(lnglats.map((item) => LngLat(item.lng, item.lat)));
  };

  useEffect(() => {
    const map = initMap('situationMap');
    markersLayer.current = L.featureGroup();
    markersLayer.current.on('click', (e) => {
      const { id } = e.layer.options;
      setPlayId(id);
      setIsShowplayer(true);
    });
    polygonLayer.current.addTo(map);
    mapRef.current = map;
    clusterGroupLayer.current = L.markerClusterGroup({
      zoomToBoundsOnClick: false,
      maxClusterRadius: (zoom) => (zoom === 18 ? 1 : 80),
    }).addTo(mapRef.current);
  }, []);

  useEffect(() => {
    addPolygonToMap(range.map((lnglat) => LngLat(lnglat.lng, lnglat.lat)));
  }, [range]);

  useEffect(() => {
    addMarkerToMap(cameraList);
  }, [cameraList]);

  return (
    <>
      <div id="situationMap" className={styles.mapWrapper} />
      <Aliplayer
        playFormat="flv"
        visible={isShowplayer}
        startTime={moment()}
        endTime={moment()}
        cameraId={playId}
        close={() => setIsShowplayer(false)}
      />
    </>
  );
}

// const lnglats = [
//   {
//     lng: 119.260987,
//     lat: 26.079818,
//   },
//   {
//     lng: 119.260954,
//     lat: 26.079538,
//   },
//   {
//     lng: 119.261072,
//     lat: 26.079365,
//   },
//   {
//     lng: 119.26192,
//     lat: 26.078844,
//   },
//   {
//     lng: 119.262092,
//     lat: 26.078507,
//   },
//   {
//     lng: 119.261856,
//     lat: 26.077958,
//   },
//   {
//     lng: 119.261759,
//     lat: 26.07738,
//   },
//   {
//     lng: 119.262102,
//     lat: 26.077071,
//   },
//   {
//     lng: 119.263358,
//     lat: 26.078526,
//   },
//   {
//     lng: 119.265825,
//     lat: 26.078893,
//   },
//   {
//     lng: 119.265461,
//     lat: 26.079644,
//   },
//   {
//     lng: 119.264774,
//     lat: 26.080425,
//   },
//   {
//     lng: 119.264731,
//     lat: 26.080666,
//   },
//   {
//     lng: 119.264237,
//     lat: 26.080656,
//   },
//   {
//     lng: 119.263733,
//     lat: 26.081205,
//   },
//   {
//     lng: 119.262993,
//     lat: 26.081533,
//   },
//   {
//     lng: 119.261684,
//     lat: 26.081591,
//   },
//   {
//     lng: 119.260944,
//     lat: 26.081099,
//   },
//   {
//     lng: 119.261126,
//     lat: 26.080887,
//   },
//   {
//     lng: 119.260976,
//     lat: 26.079702,
//   },
// ];
