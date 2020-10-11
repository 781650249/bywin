import request from '@/utils/request';
import URL from './url';

export const getHistoricalTrack = (pamera = {}) => request.get(URL.GET_VEHICLE_HISTORICAL_TRACK, { ...pamera });
