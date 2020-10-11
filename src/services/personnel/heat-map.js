import request from '@/utils/request';

export const getStatistics = (params) =>
  request.post('/personnelManagementApi/statistics/getStatisticsByCamera', { ...params });

export const getPeopleCount = (params) =>
  request.post('/personnelManagementApi/statistics/getStatisticsByGarden', { ...params });

export const getStatisticsRange = (params) =>
  request.post('/personnelManagementApi/statistics/getSubsectionStatisticsByGarden', { ...params });


  export const getStaticsPercent = (params) =>
  request.post('/personnelManagementApi/statistics/getStatisticsCountGroupByBarrier', { ...params });