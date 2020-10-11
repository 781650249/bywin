import request from '@/utils/request';
import URL from './url';

export const getStatisticalData = () => request.get(URL.GET_SITUATION_STATISTICAL_DATA, {});

export const getPeopleFlowTrend = () => request.get(URL.GET_PEOPLE_FLOW_TREND, {});

export const getCarFlowTrend = () => request.get(URL.GET_CAR_FlOW_TREND, {});
