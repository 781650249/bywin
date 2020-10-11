import request from '@/utils/request';
import { session } from '@/utils/storage'
import URL from './url';

export const getOrgTree = (params) => request.get(URL.GET_ORG_TREE, {...params});

export const getInfoByTree = (params) => request.post(URL.GET_COMMUNITY_INFO_BYTREE, {...params});

export const getBuildings = (params) => request.get(URL.GET_BUILDING_BY_COMMUNITYID, {...params});

export const getPersonnelCount = (params) => request.get(URL.GET_PERSONNEL_COUNT, {...params});

export const getUnitList = (params) => request.get(URL.GET_UNIT_LIST, {...params})

export const getPersonnelInfoByHouse = (params) => request.post(URL.GET_POP_BY_HOUSE, {...params});

export const downloadCommunity = (params) => request.get(URL.DOWNLOAD_COMMUNITY, { ...params });

export const importCommunityExcel = (params) => request.post(URL.IMPORT_EXCEL, params , {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: session.get('token') || ''
 },
});

export const eidtPersonnelInfo = (params) => request.post(URL.EIDT_PERSONNEL_INFO, { ...params });

export const getPersonnelById = (params) => request.post(URL.GET_PERSONNEL_BYID, { ...params });

export const deletePersonnelInfo = (params) => request.get(URL.DELETE_PERSONNEL, { ...params });

export const getHouseInfo = (params) => request.get(URL.GET_HOUSE_INFO, { ...params });

export const getCompanyList = (params) => request.get(URL.GET_COMPANY_LIST, { ...params });