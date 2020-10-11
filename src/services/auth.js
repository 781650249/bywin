import request from '@/utils/request';
import URL from './url';

export const login = (params) => request.post(URL.LOGIN, { ...params });

export const logout = () => request.post(URL.LOGOUT);

export const getToken = (params) => request.post(URL.GET_TOKEN, { ...params });

export const checkLogin = (params = {}) => request.get(URL.CHECK_LOGIN, { ...params });
