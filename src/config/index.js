const layerUrls = {
  TileLayer:
    'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
  // WMS: 'http://192.168.1.147:18080/geowebcache/service/wms',
  WMS: '/map/geowebcache/service/wms',
};

const layerType = 'TileLayer'; // TileLayer || WMS

export const mapOptions = {
  center: {
    lng: 87.328316,
    lat: 44.030022,
  },
  layerType,
  layerUrl: layerUrls[layerType],
};

export const baseURL = '/api';

/**
 * 单点登录
 * isSSO 是否使用单点登录
 * loginUrl 登录地址
 * passwordAddress 修改密码地址
 */
const domainName = '183.252.15.157:8190';
export const SSO = {
  isSSO: false,
  loginUrl: `http://${domainName}/cas/login?service=${window.location.origin}`,
  passwordAddress: `http://${domainName}/frameMenu/updatePassWord`,
};
export const wsBaseUrl = `ws://${window.location.host}/ws/webSocket`;
// export const wsBaseUrl = `ws://${window.location.host}/ws/webSocket`;
export const wsUrl = `${wsBaseUrl}/screen`;
// 'ws://183.252.15.157:9080/ws/webSocket/screen
// 'ws://183.252.15.157:8225/ws/webSocket/screen/admin'

export const theme = 'dark'; // light || dark

export default {
  mapOptions,
  baseURL,
  SSO,
  wsUrl,
  theme,
};
