export default {
  GET_ALL_INSPECTION: '/smartPatrolApi/selectAllInspectionRoute', // 获取巡逻方案列表
  GET_INSPECTION_SITE_BYID: '/smartPatrolApi/selectInspectionSiteByXlxxbz', // 根据巡逻方案标识查询线路列表
  GET_PATROL_WARN_LOG: '/smartPatrolApi/getPatrolInspectionLog',  // 根据巡逻方案标识查询预警记录
  GET_EMPLOYEE_LIST: '/smartPatrolApi/getEmployeeList', // 获取员工列表
  GET_MODEL_ARITHMETIC_LIST: '/smartPatrolApi/getModelArithmeticList', // 获取事件/算法列表
  EDIT_PATROL_LINE: '/smartPatrolApi/editPatrolLine', // 新增or更新巡查线路
  GET_PATROL_LINE_BYID: '/smartPatrolApi/getPatrolLineById', // 根据巡查线路信息标识查询巡查任务详情
  DELETE_PATROL_LINE: '/smartPatrolApi/delPatrolLine', // 删除巡逻路线
  GET_PATROL_CAMERA_LIST: '/smartPatrolApi/selectCameraList',  // 巡逻点摄像头列表
};
