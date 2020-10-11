import request from '@/utils/request';
import URL from './url';

export const getOrgList = (params) => request.get(URL.GET_ORG_LIST, {...params});

export const getOrgPicByPids = params => {
  const { pids } = params;
  return request.get(`${URL.GET_ORG_PIC_BYPIDS}?pids=${pids}`);
};

export const getTrajectoryByPidtx = params => {
  const { pid, pidtx } = params;
  return request.get(`${URL.GET_TRACK_BY_PIDTX}?pid=${pid}&pidtx=${pidtx}`);
}; // 查同行轨迹

export const getOrgTypeList = () => request.get(URL.GET_ORG_TYPE_LIST);