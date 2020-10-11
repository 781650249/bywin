import React, { useRef, useEffect } from 'react';
import { useSelector  } from 'dva';
import { initMap } from '@/utils/leafletMap';
import CommunityList from './CommunityList'
import styles from './index.less';


export default function() {
  const mapRef = useRef(null);
  const polygonLayer = useRef(L.layerGroup());
  const { communityList } = useSelector(({ communityManage }) => communityManage);

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
  
  useEffect(() => {
    mapRef.current = initMap('communityMap');
    polygonLayer.current.addTo(mapRef.current);
  },[])

  useEffect(() => {
    addPolygonToMap(communityList.map(item => item.communityRangeVO));
  }, [communityList])

  return (
    <div className={styles.rightWrapper}>
      <div id="communityMap" className={styles.mapWrapper} />
      <CommunityList />
    </div>
  );
}
