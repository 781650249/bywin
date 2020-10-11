export default {
  // 获取小区组织机构树
  GET_ORG_TREE: '/communityInfoApi/getOrganizationTree',
  // 获取小区基本信息
  GET_COMMUNITY_INFO_BYTREE: '/communityInfoApi/getCommunityInfo',
  // 获取小区楼栋信息
  GET_BUILDING_BY_COMMUNITYID: '/communityManageApi/getBuildingByCommunity',
  // 小区人员统计
  GET_PERSONNEL_COUNT: '/communityManageApi/getPersonnelCount',
  // 获取楼房信息列表
  GET_UNIT_LIST: '/communityManageApi/getList',
  // 获取住户信息列表
  GET_POP_BY_HOUSE: '/communityManageApi/getPersonnelInfoByHouse',
  // 模板下载模块
  DOWNLOAD_COMMUNITY: '/downloadTemplateApi/downloadCommunity',
  // 导入小区信息Excel
  IMPORT_EXCEL: '/communityManageApi/importCommunityExcel',
  // 添加修改住户信息
  EIDT_PERSONNEL_INFO: '/communityManageApi/eidtPersonnelInfo',
  // 根据人员信息标志查询人员信息
  GET_PERSONNEL_BYID: '/communityManageApi/getPersonnelById',
  // 删除房屋住户人员
  DELETE_PERSONNEL: '/communityManageApi/deletePersonnelInfo',
  // 获取房屋信息
  GET_HOUSE_INFO: '/communityManageApi/getHouseInfo',
  // 获取单位信息
  GET_COMPANY_LIST: '/communityManageApi/getCompanyList',
};