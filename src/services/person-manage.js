import request from '@/utils/request';
import URL from './url';

export const getKeyPersonList = (params) => request.post(URL.GET_KEY_PERSON_LIST, { ...params });

export const addKeyPerson = (params) => request.post(URL.ADD_KEY_PERSON, { ...params });

export const updateKeyPerson = (params) => request.post(URL.UPDATE_KEY_PERSON, { ...params });

export const deleteKeyPerson = (params) => request.get(URL.DELETE_KEY_PERSON, { ...params });

export const getKeyPersonById = (params) => request.get(URL.GET_KEY_PERSON_BY_ID, { ...params });

export const getKeyPersonWarningRuleList = (params) => request.get(URL.GET_KEY_PERSON_WARNING_RULE_LIST, { ...params });

export const getKeyPersonTagList = (params) => request.get(URL.GET_KEY_PERSON_TAG_LIST, { ...params });

export const addKeyPersonTag = (params) => request.get(URL.ADD_KEY_PERSON_TAG, { ...params });

export const deleteKeyPersonTag = (params) => request.get(URL.DELETE_KEY_PERSON_TAG, { ...params });




export const getCareTargetList = (params) => request.post(URL.GET_CARE_TARGET_LIST, { ...params });

export const addCareTarget = (params) => request.post(URL.ADD_CARE_TARGET, { ...params });

export const updateCareTarget = (params) => request.post(URL.UPDATE_CARE_TARGET, { ...params });

export const deleteCareTarget = (params) => request.get(URL.DELETE_CARE_TARGET, { ...params });

export const getCareTargetWarningRuleList = (params) => request.get(URL.GET_CARE_TARGET_WARNING_RULE_LIST, { ...params });

export const getCareTargetTagList = (params) => request.get(URL.GET_CARE_TARGET_TAG_LIST, { ...params });

export const addCareTargetTag = (params) => request.get(URL.ADD_CARE_TARGET_TAG, { ...params });

export const deleteCareTargetTag = (params) => request.get(URL.DELETE_KEY_PERSON_TAG, { ...params });


