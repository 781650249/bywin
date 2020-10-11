import request from '@/utils/request';

// GET
export const getBaseInfo = async (params) => {
  try {
    const res = await request.get('/carRecordApi/getBaseInfo', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
};

// 轨迹
export const getTrack = async (params) => {
  try {
    const res = await request.get('/carRecordApi/getCarTrack', { ...params });
    if (res.data.length === 1) {
      return res.data[0].carPlateList.map((item) => {
        const {
          id,
          jd,
          wd,
          carId: cameraId,
          realTime: time,
          address,
          frameFileId: imageUrl,
          frameFileId: fullUrl,
        } = item;
        return {
          id,
          lng: Number(jd),
          lat: Number(wd),
          imageUrl,
          fullUrl,
          cameraId,
          address,
          time,
        };
      });
    }
    return [];
  } catch (error) {
    return [];
  }
};

// 进出记录 POST
export const getInOutRecord = async (params) => {
  try {
    const { page: pageNum, pageSize, ...body } = params;
    const res = await request.post('/carRecordApi/getInOutRecordList', {
      pageNum,
      pageSize,
      ...body,
    });
    return res.data;
  } catch (error) {
    return {
      list: [],
      total: 0,
    };
  }
};

// 事件记录
export const getEventRecord = async (params) => {
  try {
    const { page: pageNum, pageSize, ...body } = params;
    const res = await request.post('/carRecordApi/getEventList', { pageNum, pageSize, ...body });
    return res.data || { list: [], total: 0 };
  } catch (error) {
    return {
      list: [],
      total: 0,
    };
  }
};
