import request from '@/utils/request';

// 获取空调信息和列表 fwxxbz 房屋信息标识 ldxxbz 楼栋信息标识 lch 楼层号 fwbh 房屋编号
export const getList = (params) => {
  const { page, size, ...body } = params;
  return request.post(
    '/airControlApi/get',
    { ...body },
    {
      params: {
        page,
        size,
      },
    },
  );
};

export const getAvgData = (params) => request.get('/airControlApi/getAvgData', { ...params })

// 空调控制
export const update = (params) => request.post('/airControlApi/update', { ...params });

// 获取房屋信息
export const getTreeData = (params) => request.get('/airControlApi/getAirTree', { ...params });
