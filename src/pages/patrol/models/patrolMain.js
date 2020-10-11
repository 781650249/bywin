import { getAllInspection, getInspectionSiteById } from '@/services/patrol';

const initState = {
  isEditShow: false,
  patrolSchemeList: [],
  selectedSchemeObj: {
    taskId: null,
    taskName: null,
    taskType: null,
  },
  patrolRouteList: [],
  patrolRouteDetail: {},
};

export default {
  namespace: 'patrolMain',
  state: {
    ...initState,
  },
  effects: {
    *getAllInspection({ payload }, { call, put }) {
      const { data } = yield call(getAllInspection, payload);
      const { rows } = data;
      if (Array.isArray(rows) && rows.length !== 0) {
        yield put({
          type: 'setState',
          payload: {
            patrolSchemeList: rows.map((item) => ({
              ...item,
              taskId: item.inspectionRouteId,
              taskName: item.inspectionRouteName,
              taskType: item.taskType,
            })),
            selectedSchemeObj: {
              taskId: rows[0].inspectionRouteId,
              taskName: rows[0].inspectionRouteName,
              taskType: rows[0].taskType,
            },
          },
        });
      }
    },
    *getInspectionSiteById({ payload }, { call, put }) {
      const { data } = yield call(getInspectionSiteById, payload);
      const { rows } = data;
      if(Array.isArray(rows) && rows.length > 0) {
        yield put({
          type: 'setState',
          payload: {
            patrolRouteList: rows[0].inspectionsiteList.map((item) => ({
              lng: item.jd,
              lat: item.wd,
              sxtName: item.sxtName,
              sxtId: item.sxtId,
            })),
            patrolRouteDetail: {
              employeeNames: rows[0].employeeName,
              sxsjKs: rows[0].effectBeginTime,
              sxsjJs: rows[0].effectEndTime,
              taskCount: rows[0].taskCount,
              taskCountTimeList: rows[0].inspectionRouteTimeList ? JSON.parse(rows[0].inspectionRouteTimeList) : [],
              taskTypeCn: rows[0].taskType === '0' ? rows[0].employeeName.join(',') : '智能巡检',
            }
          },
        });
      }
    },
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        ...initState,
      };
    },
  },
};
