import { message } from 'antd';
import request from '@/utils/request';

// 获取预警列表
export const getPrewarningList = async (params) => {
  try {
    const { page, pageSize: size, ...body } = params;
    const res = await request.post(
      '/sudPreApi/warnEvent/list',
      { ...body },
      { params: { page, size } },
    );
    return res.data;
  } catch (error) {
    return { rows: [], total: 0 };
  }
};

// 获取摄像头和红外感应器数据
export const getDeviceTree = async (params) => {
  try {
    const res = await request.get('/sudPreApi/getDeviceTree', { ...params });
    const treeFormat = (data, parentKey) =>
      data.map((item) => {
        const { deviceType, deviceId, title, children } = item;
        let key = `${parentKey ? `${parentKey}&` : ''}${title}`;
        if (deviceId) {
          key = `${deviceType}&${deviceId}`;
        }
        if (Array.isArray(children) && children.length > 0) {
          return {
            key,
            title,
            selectable: false,
            children: treeFormat(children, key),
          };
        }
        return {
          key,
          title,
        };
      });
    return treeFormat(res.data);
  } catch (error) {
    return [];
  }
};

export const getPrewarningEventConfig = async ({ id = null }) => {
  const res = await request.get(`/sudPreApi/get/${id}`, {});
  return res.data;
};

export const getPrewarningEventList = async (params) => {
  try {
    const res = await request.post('/sudPreApi/list', { ...params });
    return res.data;
  } catch (error) {
    return [];
  }
};

export const deleteEvent = async ({ id = null }) => {
  try {
    await request.delete(`/sudPreApi/del/${id}`, {});
    return true;
  } catch (error) {
    return false;
  }
};

export const saveEvent = async (params) => {
  try {
    await request.post('/sudPreApi/save', { ...params });
    return true;
  } catch (error) {
    message.warning(error.message)
    return false;
  }
};
