import request from '@/utils/request';

// GET /personnelRecordApi/getPersonnelInfo
export const getBaseInfo = async (params) => {
  try {
    const res = await request.get('/personnelRecordApi/getPersonnelInfo', { ...params });
    return res.data;
  } catch (error) {
    return {};
  }
};

// GET
export const getTrack = async (params) => {
  try {
    const res = await request.post('/personnelRecordApi/getTrackById', { ...params });
    return res.data.map((item) => {
      const {
        id,
        jd,
        wd,
        sxtId: cameraId,
        wzbjsj: time,
        address,
        cjtobjectUrl: imageUrl,
        ytobjectUrl: fullUrl,
        zsjXzb: startX,
        zsjYzb: startY,
        yxjXzb: endX,
        yxjYzb: endY,
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
        relativePosition: {
          startX,
          startY,
          endX,
          endY,
        },
      };
    });
  } catch (error) {
    return [];
  }
};

// 出入记录
export const getInOutRecord = async (params) => {
  try {
    const { page, pageSize: size, ...body } = params;
    const res = await request.post('/personnelRecordApi/getInOutRecord', { page, size, ...body });
    return res.data;
  } catch (error) {
    return {
      rows: [],
      total: 0,
    };
  }
};

// 事件记录
export const getEventRecord = async (params) => {
  try {
    const { page, pageSize: size, ...body } = params;
    const res = await request.post('/personnelRecordApi/getEventRecord', {
      page,
      size,
      ...body,
    });
    return res.data || { rows: [], total: 0 };
  } catch (error) {
    return {
      rows: [],
      total: 0,
    };
  }
};

// 访客记录
export const getVisitorRecord = async (params) => {
  try {
    const { page, pageSize: size, ...body } = params;
    const res = await request.post('/personnelRecordApi/getVisitorRecord', {
      page,
      size,
      ...body,
    });
    return res.data || { rows: [], total: 0 };
  } catch (error) {
    return {
      rows: [],
      total: 0,
    };
  }
};
