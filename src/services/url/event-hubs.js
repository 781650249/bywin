export default {
  // 获取来登去销列表
  GET_COME_GO_LIST: '/personInfo/getRecordedPerson',
  // 获取小区列表
  GET_COMMUNITY_LIST: '/communityInfoApi/getList',
  // 登记人员基本信息
  ADD_PERSON_INFO: '/personInfo/addPersonInfo',
  // 获取重点人员列表
  GET_ZDRY_LIST: '/eventCenterApi/getZdryEventPersonList',
  // 获取人员聚集列表
  GET_POP_GARHER_LIST: '/eventCenterApi/getPersonnelGatherList',
  // 获取未带口罩列表
  GET_UNMASK_LIST: '/eventCenterApi/getNoMaskList',
  // 获取高空抛物列表
  GET_HIGH_TOSS_ACT_LIST: '/eventCenterApi/getHighTossActList',
  // 获取老人倒地不起列表
  GET_LIE_DOWN_LIST: '/eventCenterApi/getLiedownList', 
  // 处置-通知事件
  DISPOSE_EVENT: '/eventCenterApi/disposeEvent',
  // 根据pid获取人员基本信息档案
  GET_PERSON_INFO_BYPID: '/personInfo/getPersonInfoByPid',
  // 更新登记人员基本信息档案
  UPDATE_PERSON_INFO: '/personInfo/updatePersonInfo',

  // 事件统计接口
  DISPOSE_EVENT_COUNT: '/eventCenterApi/disposeEventCount',
  // 获取楼栋级联信息（楼栋-单元-房屋）
  GET_BUILDING_CASCADE: '/communityManageApi/getBuildingCascade'
};