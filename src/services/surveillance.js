import request from '@/utils/request';

/*
 底下为人员布防模块接口
 ---------------------------------------
*/

//  获取近七天人员预警统计信息
export const getPopWeekWarn = async () => {
  try {
    const res = await request.get('/personnelControlApi/getSevenDaysCount');
    return res.data;
  } catch (error) {
    return [];
  }
};

// 获取本日检测统计信息
export const getPopToDayCount = async () => {
  try {
    const res = await request.get('/personnelControlApi/getToDayCount');
    return res.data;
  } catch (error) {
    return [];
  }
};

// 获取区域信息统计列表
export const getAreaInfoList = async () => {
  try {
    const res = await request.get('/personnelControlApi/getAreaCount');
    return res.data;
  } catch (error) {
    return [];
  }
};

// /personnelControlApi/getEventAlertList 获取人员预警事件列表
export const getPopWarnList = async (params) => {
  try {
    const res = await request.post('/personnelControlApi/getEventAlertList', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
};

// 获取人员布控任务列表信息
export const getPopCtrlList = async () => {
  try {
    const res = await request.get('/personnelControlApi/getControlList');
    return res.data;
  } catch (error) {
    return [];
  }
};

// 根据布控id获取人员布控任务详细信息
export const getCtrlDetailById = async (params) => {
  try {
    const res = await request.get('/personnelControlApi/getControlById', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
};

// /ssjkApi/selectCameraListByCommunity 获取区域设备列表
export const getQYSBList = async () => {
  try {
    const res = await request.post('/ssjkApi/selectCameraListByCommunity');
    return res.data;
  } catch (error) {
    return [];
  }
}

// /personnelManagementApi/getPersonnelList 获取人员列表（导入用）
export const getPersonnelList = async (params) => {
  try {
    const res = await request.post('/personnelManagementApi/getPersonnelList', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
}

// /personnelControlApi/editPersonnelControl  新增修改人员区域布控信息
export const editPersonnelControl = async (params) => {
  try {
    await request.post('/personnelControlApi/editPersonnelControl', { ...params });
    return true;
  } catch (error) {
    return false;
  }
}

// /personnelControlApi/delPersonnelControl 删除人员布控任务
export const deletePopCtrlTask = async (params) => {
  try {
    await request.get('/personnelControlApi/delPersonnelControl', { ...params });
    return true;
  } catch (error) {
    return false;
  }
}

// /personnelControlApi/getWarnningInfoById  获取人员预警信息详情
export const getPopWarnInfoById = async (params) => {
  try {
    const res = await request.get('/personnelControlApi/getWarnningInfoById', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
}

/*
  底下为车辆布防模块接口
  --------------------------------------------------
*/

// 获取预警统计7日统计次数 /carCtrlApi/warn/info
export const getWeekWarn = async () => {
  try {
    const res = await request.get('/carCtrlApi/warn/info');
    return res.data;
  } catch (error) {
    return {};
  }
};

// 获取7日车流量 /permanentCarApi/getCarFlowStatistics
export const getCarFlowStatistics = async () => {
  try {
    const res = await request.get('/permanentCarApi/getCarFlowStatistics');
    return res.data;
  } catch (error) {
    return {};
  }
};

// 获取车辆预警列表
export const getCarWarnList = async (params) => {
  try {
    const { page, size, ...body } = params;
    const res = await request.post(
      '/carCtrlApi/warn/list',
      { ...body },
      { params: { page, size } },
    );
    return res.data;
  } catch (error) {
    return {};
  }
};

// 查询具体车辆布控预警详情 /carCtrlApi/warn/detail
export const getCarWarnDetail = async (params) => {
  try {
    const res = await request.get('/carCtrlApi/warn/detail', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
};

// 查询车辆布控列表
export const getCarCtrlList = async (params) => {
  try {
    const { page, size, ...body } = params;
    const res = await request.post('/carCtrlApi/list', { ...body }, { params: { page, size } });
    return res.data;
  } catch (error) {
    return {};
  }
};

// 获取全部车辆列表（导入用）
export const getAllCarList = async (params) => {
  try {
    const res = await request.post('carManageApi/listCarInfo', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
};

// 批量添加车辆布控 /carCtrlApi/batchAdd
export const batchAddCarCtrl = async (params) => {
  try {
    await request.post('/carCtrlApi/batchAdd', { ...params });
    return true;
  } catch (error) {
    return false;
  }
};

/*
  底下为人员车辆布防模块通用接口
  --------------------------------------------------
*/

// 添加预警通知
export const addWarnNotify = async (params) => {
  try {
    await request.post('/carCtrlApi/notify/add', { ...params });
    return true;
  } catch (error) {
    return false;
  }
};

// 获取预警通知列表
export const getWarnNotifyList = async (params) => {
  try {
    const { page, size, ...body } = params;
    const res = await request.post(
      '/carCtrlApi/notify/list',
      { ...body },
      { params: { page, size } },
    );
    return res.data;
  } catch (error) {
    return {};
  }
};
