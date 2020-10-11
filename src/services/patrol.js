import request from '@/utils/request';
import URL from './url';

export const getAllInspection = (params = {}) => request.post(URL.GET_ALL_INSPECTION, { ...params });

export const getInspectionSiteById = (params = {}) => request.get(URL.GET_INSPECTION_SITE_BYID, { ...params })

export const getPatrolWarnLog = (params = {}) => request.post(URL.GET_PATROL_WARN_LOG, { ...params });

export const getEmployeeList = (params = {}) => request.post(URL.GET_EMPLOYEE_LIST, { ...params });

export const getModelArithmeticList = (params = {}) => request.get(URL.GET_MODEL_ARITHMETIC_LIST, { ...params });

export const editPatrolLine = (params = {}) => request.post(URL.EDIT_PATROL_LINE, { ...params });

export const getPatrolLineById = (params = {}) => request.get(URL.GET_PATROL_LINE_BYID, { ...params });

export const deletePatrolLine = (params = {}) => request.get(URL.DELETE_PATROL_LINE, { ...params });

export const getPatrolCameraList = (params = {}) => request.get(URL.GET_PATROL_CAMERA_LIST, { ...params });