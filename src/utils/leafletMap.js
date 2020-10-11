import { mapOptions } from '@/config';

const { center, layerType, layerUrl } = mapOptions;

/**
 * 坐标转换
 * @param {Number} lng
 * @param {Number} lat
 */
export const LngLat = (lng, lat) => {
  if (typeof lng !== 'number' || typeof lat !== 'number') return null;
  return L.latLng({ lat, lng });
};

/**
 * 坐标反转
 * @param {Number} lng
 * @param {Number} lat
 */
export const Lonlat = (lng, lat) => ({ lng, lat });

export const initMap = (id = 'map', options = {}) => {
  if (!id) return false;
  const { lat, lng } = center;
  const map = L.map(id, {
    renderer: L.canvas(),
    center: LngLat(lng, lat),
    zoom: 14,
    minZoom: 6,
    maxZoom: 18,
    zoomControl: false,
    doubleClickZoom: false,
    ...options,
  });

  // 缩放控件
  // L.control
  //   .zoom({
  //     position: 'bottomright',
  //     zoomInTitle: '放大',
  //     zoomOutTitle: '缩小',
  //   })
  //   .addTo(map);

  // L.tileLayer
  //   .wms('http://192.168.97.123:8080/geowebcache/service/wms', {
  //     layers: 'bywinMap',
  //     format: 'image/png',
  //   })
  //   .addTo(map);

  // 按配置加载图层
  if (layerType === 'TileLayer') {
    L.tileLayer(layerUrl, {
      subdomains: ['1', '2', '3', '4'],
      attribution: '',
    }).addTo(map);
  } else {
    L.tileLayer
      .wms(layerUrl, {
        layers: 'bywinMap',
        format: 'image/png',
      })
      .addTo(map);
  }

  // 设置leafletPip坐标格式和leaflet一致
  window.leafletPip.bassackwards = true;

  return map;
};

export default {
  initMap,
  LngLat,
  Lonlat,
};
