import request from '@/utils/request';
import URL from './url';

export const getCommunityInfo = (params) => request.post(URL.GET_COMMUNITY_INFO, { ...params });

export const getCommunityList = (params) => request.get(URL.GET_COMMUNITY_LIST, { ...params });

export const getCameraList = (params) =>
  request.post(URL.GET_GAMERA_LIST, {
    startTime: ':00',
    stopTime: ':00',
    ...params,
  });

export const putImageByBase64 = async (params) => {
  try {
    const res = await request.post(URL.BASE64_TO_URL, { ...params })
    return res.data;
  } catch (error) {
    return ''
  }
};

export const switchDataSource = (params) => request.get(URL.SWITCH_DATA_SOURCE, { ...params });

export const getCommunityOrg = (params) => request.get(URL.GET_COMMUNITY_ORG, { ...params });

export const getListV2 = (params) => request.post(URL.GET_LIST_V2, { ...params });

export const authUserCommunity = (params) => request.post(URL.AUTH_USER_COM, { ...params });