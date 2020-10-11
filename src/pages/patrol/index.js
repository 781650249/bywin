import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { initMap } from '@/utils/leafletMap';
import SchemeRoute from './SchemeRoute';
import WarnRecord from './WarnRecord';
import EditScheme from './EditScheme';
import styles from './index.less';

export default function() {
  const mapRef = useRef(null);
  const markerLayer = useRef(L.featureGroup());
  const dispatch = useDispatch();
  const [isShowplayer, setIsShowplayer] = useState(false);
  const [play, setPlay] = useState({ playId: '', playName: '' });
  const { patrolRouteList } = useSelector(({ patrolMain }) => patrolMain);

  useEffect(() => {
    mapRef.current = initMap('patrolMap', { zoom: 18 });
    markerLayer.current.addTo(mapRef.current);
    return () => {
      dispatch({
        type: 'patrolMain/setState',
        payload: { isEditShow: false, patrolRouteList: [] },
      });
      const { current } = markerLayer;
      current.clearLayers();
    };
  }, [dispatch]);

  useEffect(() => {
    markerLayer.current.clearLayers();
    if (Array.isArray(patrolRouteList) && patrolRouteList.length !== 0 && mapRef.current) {
      patrolRouteList.forEach((el) => {
        markerLayer.current.addLayer(
          L.marker([el.lat, el.lng], {
            icon: L.divIcon({
              html: `<div class="map-camera"></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 28],
            }),
            title: el.sxtName,
            id: el.sxtId,
          }),
        );
      });
      markerLayer.current.on('click', (e) => {
        const { id, title } = e.layer.options;
        setIsShowplayer(true);
        setPlay({ playId: id, playName: title });
      });
      mapRef.current.fitBounds(
        patrolRouteList.map((el) => ({ lng: Number(el.lng), lat: Number(el.lat) })),
      );
    }
  }, [patrolRouteList]);

  const changeMapCenter = (lnglat) => {
    mapRef.current.fitBounds([lnglat]);
  };

  const handleChangePlay = (params) => {
    setPlay({ ...params })
  }

  return (
    <div className={styles.wrapper}>
      <div id="patrolMap" className={styles.mapWrapper} />
      <SchemeRoute
        changeMapCenter={changeMapCenter}
        isShowplayer={isShowplayer}
        play={play}
        handleOpen={() => setIsShowplayer(true)}
        handleClose={() => setIsShowplayer(false)}
        handleChangePlay={handleChangePlay}
      />
      <WarnRecord />
      <EditScheme />
    </div>
  );
}
