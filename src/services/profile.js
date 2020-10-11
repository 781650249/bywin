import request from '@/utils/request';
import URL from './url';

export const getPersonInfo = (params = {}) => request.post(URL.GET_PERSON_INFO_BY_ID, { ...params });

export const getVehicleInfo = (params = {}) => request.post(URL.GET_VEHICLE_INFO_BY_ID, { ...params });

export const getHistoricalTrack = (params = {}) => request.post(URL.GET_HISTORICAL_TRACK, { ...params });

export const getRelationEntity = (params = {}) => request.get(URL.GET_RELATION_ENTITY, { ...params });

export const getTrajectoryByPidtx = (params = {}) => {
  const { pid, pidtx } = params
  return request.get(`${URL.GET_TRACK_BY_PIDTX}?pid=${pid}&pidtx=${pidtx}`);
}

export const getPidBehaviorTrace = (params = {}) => request.get(URL.GET_BEHAVIOR_TRACE, { ...params });
