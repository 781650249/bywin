import request from '@/utils/request';

export const getElevatorTree = (params = {}) =>
  request.get('/elevatorManageApi/getElevatorTree', { ...params }); // 获取小区电梯树

export const getElevatorInfo = (params = {}) =>
  request.get('/elevatorManageApi/getElevatorInfo', { ...params }); // 查询电梯基本信息

export const getListOperationInfo = (params = {}) =>
  request.post('/elevatorManageApi/listOperationInfo', { ...params }); // 查询电梯运行信息列表

export const getListWarnRecord = (params = {}) =>
  request.post('/elevatorManageApi/listWarnRecord', { ...params }); // 查询电梯预警记录列表
