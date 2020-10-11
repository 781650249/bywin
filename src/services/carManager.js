import request from '@/utils/request';
import { session } from '@/utils/storage';
import URL from './url';

export const getCarList = (params) => request.post(URL.GET_CAR_LIST, { ...params });

export const addCarInfo = (params) => request.post(URL.ADD_CAR_INFO, { ...params });

export const deleteCarInfo = (params) => request.get(URL.DELETE_CAR_INFO, { ...params });

export const updateCarInfo = (params) => request.post(URL.UPDATE_CAR_INFO, { ...params });

export const getCompanyList = (params) => request.post(URL.GET_COMPANY_LIST, { ...params });

// 导入车辆excel
export const importCarExcel = (params) =>
  request.post(URL.IMPORT_EXCEL, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: session.get('token') || '',
    },
  });

export const getPersonnelByPhone = (params) =>
  request.get(URL.GET_PERSONNERL_BY_PHONE, { ...params });

export const getBarrierTree = (params) => request.get(URL.GET_BARRIER_TREE, { ...params });

export const getWhiteList = (params) => request.post(URL.GET_WHITE_LIST, { ...params });

export const getNotInWhite = (params) => request.get(URL.GET_NOT_INWHITE, { ...params });

export const getCarToWhite = (params) => request.post(URL.GET_CAR_TOWHITE, { ...params });

export const deleteCarFromWhite = (params) => request.get(URL.DELETE_CAR_FROMWHITE, { ...params });

export const getWarnConfigByCameraId = (params) =>
  request.get(URL.GET_WARN_CONFIG_BYCAMERAID, { ...params });

export const saveWarnConfig = (params) => request.post(URL.SAVE_WARN_CONFIG, { ...params });

export const getRecordList = (params) => request.post(URL.GET_RECORD_LIST, { ...params });

export const getCarWarnList = (params) => request.post(URL.GET_CAR_WARN_LIST, { ...params });

export const getPersonnelList = (params) => request.post(URL.GET_PERSONNERL_LIST, { ...params });

export const getCarWarnDetail = (params) => request.get(URL.GET_CAR_WARN_DETAIL, { ...params });

const treeData = (data) =>
  data.map((item, index) => {
    if (Array.isArray(item.barrierInfoList)) {
      return {
        key: index,
        title: item.xqmc,
        selectable: false,
        children: item.barrierInfoList.map((i) => ({
          key:  - i.id,
          title: i.barrierName,
          id: i.id,
        })),
      };
    }
    return {
      key: index,
      title: item.xqmc,
    };
  });

export const getTreeList = async () => {
  try {
    const { data } = await request.get(URL.GET_CAR_Tree_List, {});
    return treeData(data);
  } catch {
    return [];
  }
};

// getTreeList();
