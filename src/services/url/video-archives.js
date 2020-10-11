export default {
  // 统计常住人口
  GET_PERMANENT_PEOPLE: '/permanentPersonnelApi/getPermanentPeople',
  // 统计今日访客
  GET_TODAY_VISITOR: '/permanentPersonnelApi/getTodayVisitor',
  // 获取人流近七日趋势
  GET_PEOPLE_WEEK: '/permanentPersonnelApi/getPeopleFlowStatistics',
  // 获取车流近七日趋势
  GET_CAR_WEEK: '/permanentCarApi/getCarFlowStatistics',
  // 过人过车-过人接口
  GET_PERSON_PASSED_BY: '/videoArchivesApi/getPassPeople',
  // 过人过车-过车接口
  GET_VEHICLE_PASSED_BY: '/videoArchivesApi/getPassCar',
  // 获取摄像头列表
  GET_CAMERA_LIST: '/videoSchedulApi/selectCameraListBySchedulLogTime',
  // 获取实时视频地址
  GET_LIVE_VIDEO_URL: '/videoPlay/getPlayLiveVideoUrl',
  // 获取历史视频地址
  GET_HISTORY_VIDEO_URL: '/videoPlay/getPlayHistoryVideoUrl',

  // 获取视频档案人员信息统计
  GET_PERSON_COUNT: '/videoArchivesApi/getPersonCount',
  // 获取视频档案车辆信息统计
  GET_CAR_COUNT: '/videoArchivesApi/getVehicleCount',
  // 获取设备信息
  GET_DEVICE_INFO: '/ssjkApi/selectCameraBySxtId',
  // 获取摄像头列表
  GET_Tree_LIST: '/ssjkApi/selectCameraListByCommunity',
  // 地图所有摄像头列表
  GET_CAMERA_LISTS: '/smartPatrolApi/selectCameraList',
};
