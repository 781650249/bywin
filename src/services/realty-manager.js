import request from '@/utils/request';
import URL from './url';

export const designatePerson = (params = {}) => request.get(URL.DESIGNATE_PERSON, { ...params });

export const getDetail = (params = {}) => request.get(URL.GET_DETAIL, { ...params });

export const getList = (params = {}) => request.post(URL.GET_LIST, { ...params });

export const saveInfo = (params = {}) => request.post(URL.SAVE_INFO, { ...params });

export const delNotice = (params = {}) => request.get(URL.DELETE_TEMPLATE, { ...params });

export const getNotice = (params = {}) => request.get(URL.GET_TEMPLATE_LIST, { ...params });

export const saveNotice = (params = {}) => request.post(URL.SAVE_NOTICE_TEMPLATE, { ...params });

export const updateNotice = (params = {}) =>
  request.post(URL.UPDATE_NOTICE_TEMPLATE, { ...params });

export const getManageList = (params = {}) => request.post(URL.GET_MANAGE_LIST, { ...params });

export const addAnnouncement = (params = {}) =>
  request.post(URL.ADD_NOTICE_TEMPLATE, { ...params });

export const getTypeList = (params = {}) => request.get(URL.GET_TYPE_LIST, { ...params });

export const getBuilding = (params = {}) => request.get(URL.GET_BUILDING, { ...params });

export const getPersonnelList = (params) => request.post(URL.GET_PERSONNERL_LIST, { ...params });

export const saveAnnoucement = (params) => request.post(URL.SAVE_ANNOUNCEMENT_TEMPLATE, { ...params });

export const getAnnouncementDetail = (params) => request.get(URL.GET_ANNOUNCEMENT_DETAIL, { ...params });

export const deleteAnnounceMent = (params) => request.get(URL.DELETE_ANNOUNCEMENT_MENT, { ...params });

export const updateAnnounceMent = (params) => request.post(URL.UPDATE_ANNOUNCEMENT_MENT, { ...params });

