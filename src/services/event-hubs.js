import request from '@/utils/request';
import URL from './url';

export const getComeGoList = (params) => request.post(URL.GET_COME_GO_LIST, { ...params });

export const getCommunityList = () => request.get(URL.GET_COMMUNITY_LIST);

export const addPersonInfo = (params) => request.post(URL.ADD_PERSON_INFO, { ...params });

export const getZDRYList = (params) => request.post(URL.GET_ZDRY_LIST, { ...params });

export const getPersonnelGatherList = (params) => request.post(URL.GET_POP_GARHER_LIST, { ...params });

export const getUnmaskList = (params) => request.post(URL.GET_UNMASK_LIST, { ...params });

export const getHighTossActList = (params) => request.post(URL.GET_HIGH_TOSS_ACT_LIST, { ...params });

export const getLiedownList = (params) => request.post(URL.GET_LIE_DOWN_LIST, { ...params });

export const disposeEvent = (params) => request.post(URL.DISPOSE_EVENT, { ...params }); 

export const getPersonInfoByPid = (params) => request.post(URL.GET_PERSON_INFO_BYPID, { ...params });

export const updatePersonInfo = (params) => request.post(URL.UPDATE_PERSON_INFO, { ...params });

export const disposeEventCount = () => request.get(URL.DISPOSE_EVENT_COUNT);

export const getBuildingCascade = (params) => request.get(URL.GET_BUILDING_CASCADE, { ...params });