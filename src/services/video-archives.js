import request from '@/utils/request';
import URL from './url';



export const getCommunityInfo = () => request.get(URL.GET_COMMUNITY_INFO, {});

export const getPermanentPeople = () => request.get(URL.GET_PERMANENT_PEOPLE);

export const getTodayVisitor = () => request.get(URL.GET_TODAY_VISITOR);

export const getPeopleWeek = () => request.get(URL.GET_PEOPLE_WEEK);

export const getCarWeek = () => request.get(URL.GET_CAR_WEEK);

export const getPersonPassedBy = (params) => request.post(URL.GET_PERSON_PASSED_BY, { ...params });

export const getVehiclePassedBy = (params) =>
  request.post(URL.GET_VEHICLE_PASSED_BY, { ...params });

export const getCameraList = (params) => request.post(URL.GET_CAMERA_LIST, { ...params });

export const getCameraLists = (params) => request.get(URL.GET_CAMERA_LISTS, { ...params });

export const getLiveVideoUrl = (params) => request.post(URL.GET_LIVE_VIDEO_URL, { ...params });

export const getHistoryVideoUrl = (params) =>
  request.post(URL.GET_HISTORY_VIDEO_URL, { ...params });

export const getPersonCount = () => request.get(URL.GET_PERSON_COUNT);

export const getCarCount = () => request.get(URL.GET_CAR_COUNT);

export const getDeviceInfo = (params) => request.post(URL.GET_DEVICE_INFO, { ...params });

const transfer = (rows, parentKey) =>
  rows.map((item, i) => {
    let key = null;
    if (item) {
      key = i;
    }
    if (parentKey) {
      key = `${parentKey}-${key}`;
    } else {
      key = String(key);
    }
    if (Array.isArray(item.monitoringInformationlist)) {
      return {
        key,
        selectable: false,
        title: item.azdd.substring(0, 8),
        id: item.id,
        children: transfer(item.monitoringInformationlist, key),
      };
    }
    return {
      key,
      title: item.azdd.substring(0, 12),
      isOnline: item.isOnline,
      gdJd: item.gdJd,
      gdWd: item.gdWd,
      id: item.id,
      spbfbm: item.spbfbm,
      // switcherIcon: item.isOnline ? () => <>{<Sxt type="icon-shexiangtou1" />}</> : null,
      // eslint-disable-next-line react/react-in-jsx-scope   <Sxt type="icon-shexiangtou1" />
     
    };
  });

export const getTreeList = async (params) => {
  try {
    const { data } = await request.post(URL.GET_Tree_LIST, { ...params });
    return transfer(data);
  } catch {
    return [];
  }
};

export const getTreesList = (params) => request.post(URL.GET_Tree_LIST, { ...params });
