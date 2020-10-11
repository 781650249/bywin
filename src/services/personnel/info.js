import request from '@/utils/request';

export const getList = (params) => {
  const { page, pageSize: size, ...body } = params;
  return request.post('/personnelManagementApi/getPersonnelList', { page, size, ...body });
};

export const del = (params) => {
  const { id } = params;
  return request.get('/personnelManagementApi/delPersonel', { ygxxbz: id });
};

export const addOrUpdate = (params) =>
  request.post('/personnelManagementApi/editPersonnel', { ...params });

export const getInfoById = (params) => {
  const { id } = params;
  return request.get('/personnelManagementApi/getPersonnelById', { ygxxbz: id });
};

// 校验手机号是否重复
export const verifyPhone = async (params) => {
  try {
    const res = await request.get('/personnelManagementApi/verifyPhone', { ...params });
    return {
      success: res.data.code === '1',
      msg: res.data.msg,
    };
  } catch (error) {
    return {
      success: false,
      msg: '校验接口出错！',
    };
  }
};

// POST
export const importExcel = async (params) => {
  try {
    const formData = new FormData();
    (params.fileList || []).forEach((file) => {
      formData.append('multipartFile', file);
    });
    formData.append('yqxxbz', params.yqxxbz);
    await request.post('/personnelManagementApi/importEmployeeExcel', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

// 获取所有岗位
export const getPosition = async () => {
  try {
    const res = await request.get('/personnelManagementApi/getPosition', {});
    return res.data.map((item) => ({ text: item.mc, key: item.id }));
  } catch (error) {
    return [];
  }
};

export const getCompany = async () => {
  try {
    const res = await request.get('/yqCompanyManageApi/getCompanyList', {});
    return res.data.map(item => ({ text: item.dwmc, key: item.dwxxbz }));
  } catch (error) {
    return [];
  }
};
