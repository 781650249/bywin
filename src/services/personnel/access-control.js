import { message } from 'antd';
import request from '@/utils/request';
import logger from '@/utils/logger';

const treeDataFormat = (data) =>
  data.map((item) => {
    if (Array.isArray(item.barrierList)) {
      return {
        key: item.yqbh,
        title: item.yqmc,
        selectable: false,
        children: item.barrierList.map((barrier) => ({
          key: barrier.barrierId,
          title: barrier.barrierName,
        })),
      };
    }
    return {
      key: item.yqbh,
      title: item.yqmc,
    };
  });

// GET
export const getTreeData = async () => {
  try {
    const res = await request.get('/personnelManagementApi/getBarrierList', {});
    return treeDataFormat(res.data);
  } catch (error) {
    logger.log(error);
    return [];
  }
};

// POST
export const getRecord = async (params) => {
  try {
    const { page, pageSize: size, ...body } = params;
    const res = await request.post('/personnelManagementApi/getRecordList', {
      ...body,
      page,
      size,
    });
    return res.data;
  } catch (error) {
    logger.log(error);
    return { rows: [], total: 0 };
  }
};

// POST 添加白名单
export const addWhitelist = async (params) => {
  if (!params.barrierId) {
    message.warning('请选择门禁！');
    return false;
  }
  if (Array.isArray(params.employeeIds) && params.employeeIds.length === 0) {
    message.warning('请选择人员！');
    return false;
  }
  try {
    await request.post('/personnelManagementApi/addPassageWhite', { ...params });
    message.success('添加白名单成功！');
    return true;
  } catch (error) {
    logger.log(error);
    message.error('添加白名单失败！');
    return false;
  }
};

// POST 添加白名单
export const deleteWhitelist = async (params) => {
  try {
    await request.post('/personnelManagementApi/delPassageWhite', { ...params });
    message.success('删除成功！');
    return true;
  } catch (error) {
    logger.log(error);
    message.error('删除失败！');
    return false;
  }
};
