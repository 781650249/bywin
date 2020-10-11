// ref: https://umijs.org/config/

const isDark = true;
const themeConfig = isDark
  ? {
      theme: 'dark',
      white: '#fff',
      black: '#000',
      'bg-normal': '#101b43',
      'bg-dark': 'rgb(1, 12, 55)',
      'bg-light': '#223273',
      '@primary-1': 'lighten(@bg-light, 20)',
      'text-color': 'fade(@white, 85)',
      'text-color-light': 'fade(@white, 100)',
      'text-color-inverse': 'fade(@black, 65)',
      'text-color-secondary': 'fade(@white, 85%)',
      'text-color-secondary-dark': 'fade(@black, 85)',
      'icon-color-hover': '@white',
      'background-color-base': '@bg-light',
      'background-color-light': 'darken(@bg-light, 8)',
      'component-background': '@bg-normal',
      'link-color': 'lighten(@primary-color, 20)',
      'input-color': '@text-color',
      'input-bg': 'tint(@bg-normal, 10)',
      'picker-bg': '@input-bg',
      'calendar-bg': 'tint(@bg-normal, 5)',
      'disabled-bg': 'tint(@bg-normal, 5)',
      'select-background': '@input-bg',
      'pagination-item-bg': '@input-bg',
      'pagination-item-bg-active': '@input-bg',
      'pagination-item-link-bg': '@input-bg',
      'radio-solid-checked-color': '@white',
      'btn-default-bg': '@input-bg',
      'btn-default-border': '@input-bg',
      'border-color-base': '@input-bg',
      'border-color-inverse': 'tint(@bg-normal, 15)',
      'border-color-split': 'tint(@bg-normal, 20)',
      'disabled-color': 'fade(#fff, 25)',
      'disabled-color-dark': 'fade(#000, 35)',
      'item-hover-bg': 'lighten(@bg-light, 20)',
      'heading-color': 'fade(@white, 100)',
      'heading-color-dark': 'fade(@black, 100)',
      'tabs-hover-color': '@white',
      'tabs-active-color': '@white',
      'drawer-bg': '@bg-normal',
      'modal-header-bg': '@bg-normal',
      'modal-content-bg': '@bg-dark',
      'modal-footer-bg': '@bg-normal',
      'progress-remaining-color': 'fade(@white, 16)',
      'picker-basic-cell-hover-with-range-color': 'lighten(@bg-light, 10%)',
      'tree-node-selected-bg': 'lighten(@bg-light, 20)',
      'menu-highlight-color': '@white',
      'page-header-back-color': '@white',
      'anchor-bg': 'transparent',
    }
  : {};

const useJsConfig = () => {
  const urls = {
    defaltAliplayerCss: '/de/prismplayer/2.7.2/skins/default/aliplayer.css',
    aliplayerIndexCss: '/video/index.css',
    aliplayer: '/de/prismplayer/2.7.2/aliplayer.js',
    aliplayerFlv: '/de/prismplayer/2.7.2/flv/aliplayer-flv.js',
    aliplayerHls: '/de/prismplayer/2.7.2/hls/aliplayer-hls.js',
  };
  return { ...urls };
};

export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' },
        { path: '/login', component: '../pages/login' },
        { path: '/situation', component: '../pages/home' },
        // { path: '/situation', component: '../pages/situation' },
        // { path: '/smart-search', component: '../pages/smart-search' },
        { path: '/video-archives', component: '../pages/video-archives' },
        { path: '/video-archives/vehicle-file', component: '../pages/vehicle-profile' },
        { path: '/video-archives/:id', component: '../pages/profile' },
        // { path: '/person-manage', component: '../pages/person-manage' },
        // { path: '/person-manage/:id', component: '../pages/profile' },
        { path: '/community-manage', component: '../pages/community-manage' },
        { path: '/community-manage/:id', component: '../pages/community-detail' },

        // 系统配置
        { path: '/sys-config', component: '../pages/sys-config' },
        { path: '/sys-config/backstage', component: '../pages/sys-config/backstage' },
        { path: '/sys-config/timed-task', component: '../pages/sys-config/timed-task' },
        { path: '/sys-config/permission-bind', component: '../pages/sys-config/permission-bind' },
        {
          path: '/sys-config/permission-bind/add-permission',
          component: '../pages/sys-config/permission-bind/add-permission',
        },
        { path: '/sys-config/estate-bind', component: '../pages/sys-config/estate-bind' },
        {
          path: '/sys-config/estate-bind/add-permission',
          component: '../pages/sys-config/estate-bind/add-permission',
        },

        // 能效管理
        {
          path: '/energy-efficiency-monitor',
          component: '../pages/energy-efficiency/energy-efficiency-monitor',
        },
        {
          path: '/energy-efficiency-monitor/detail',
          component: '../pages/energy-efficiency/energy-efficiency-monitor/detail',
        },
        {
          path: '/lighting-control',
          component: '../pages/energy-efficiency/lighting-control',
        },
        {
          path: '/lighting-control/setting',
          component: '../pages/energy-efficiency/lighting-control/setting',
        },
        {
          path: '/air-conditioning-control',
          component: '../pages/energy-efficiency/air-conditioning-control',
        },

        // 智慧消防
        { path: '/elevator', component: '../pages/firefighting/elevator' },

        // 综合安防
        { path: '/relaTimeProtection', component: '../pages/relaTimeProtection' },
        { path: '/patrol', component: '../pages/patrol' },
        { path: '/around-prevention', component: '../pages/around-prevention' },
        { path: '/around-prevention/setting', component: '../pages/around-prevention/setting' },
        { path: '/pop-surveillance', component: '../pages/surveillance/pop-surveillance' },
        { path: '/pop-surveillance/site', component: '../pages/surveillance/pop-surveillance/site' },
        { path: '/pop-surveillance/warn-detail', component: '../pages/surveillance/pop-surveillance/warn-detail' },
        { path: '/car-surveillance', component: '../pages/surveillance/car-surveillance' },
        { path: '/car-surveillance/site', component: '../pages/surveillance/car-surveillance/site' },
        { path: '/car-surveillance/warn-detail', component: '../pages/surveillance/car-surveillance/warn-detail' },
        { path: '/event-hubs', component: '../pages/event-hubs' },
        { path: '/event-hubs/:id', component: '../pages/profile' },

        // 人员管理
        { path: '/personnel/info', component: '../pages/personnel/info' },
        { path: '/personnel/access-control', component: '../pages/personnel/access-control' },
        { path: '/personnel/heat-map', component: '../pages/personnel/heat-map' },
        { path: '/discover', component: '../pages/discover' },
        { path: '/discover/:id', component: '../pages/profile' },
        { path: '/searching-person', component: '../pages/searching' },

        // 车辆管理
        { path: '/car-manager/info', component: '../pages/car-manager/carInfo' },
        { path: '/car-manager/warn', component: '../pages/car-manager/parkWarn' },
        { path: '/car-manager/control', component: '../pages/car-manager/passingControl' },
        { path: '/searching-vehicle', component: '../pages/searching' },

        // 物业管理
        { path: '/realty-manager/notice', component: '../pages/realty-manager/notice' },
        { path: '/realty-manager/repair', component: '../pages/realty-manager/repair' },

        // 人员和车辆档案
        { path: '/personnel-file/:id', component: '../pages/file/personnel-file' },
        { path: '/vehicle-file/:id', component: '../pages/file/vehicle-file' },
      ],
    },
  ],

  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          immer: true,
        },
        dynamicImport: { webpackChunkName: true },
        title: '智慧安防小区',
        dll: true,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /styles\//,
            /utils\//,
            /config\.(t|j)sx?$/,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
            /[A-Z]/,
          ],
        },
        locale: {
          default: 'zh-CN',
          antd: true,
        },
      },
    ],
  ],
  targets: {
    ie: 11,
  },
  theme: {
    'primary-color': '#4751f1',
    ...themeConfig,
  },
  proxy: {
    '/api': {
      target: 'http://183.252.15.157:8225/api',
      pathRewrite: { '^/api': '' },
    },
  },
};
