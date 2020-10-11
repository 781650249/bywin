export default {
  // 获取小区基本信息
  GET_COMMUNITY_INFO: '/communityInfoApi/getCommunityInfo',

  // 获取小区列表
  GET_COMMUNITY_LIST: '/communityInfoApi/getList',

  // 获取小区摄像头列表
  GET_GAMERA_LIST: 'videoSchedulApi/selectCameraListBySchedulLogTime',

  // base64转url
  BASE64_TO_URL: '/uploadImage/putImageByBase64',

  // 切换小区数据源
  SWITCH_DATA_SOURCE: '/communityInfoApi/switchCommunityDataSource',

  // 用户社区权限绑定
  GET_COMMUNITY_ORG: '/communityInfoApi/getOrganizationTree',
  GET_LIST_V2: '/userApi/getListV2',
  AUTH_USER_COM: '/userApi/authUserCommunity',
};
