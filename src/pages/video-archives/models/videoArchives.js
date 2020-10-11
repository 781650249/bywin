import {
  getPeopleWeek,
  getCarWeek,
  getPersonPassedBy,
  getVehiclePassedBy,
  getPersonCount,
  getCarCount,
} from '@/services/video-archives';

const initState = {
  communityInfo: {},
  weekFlowList: [],
  popCarCount: {},
  passTotal: 0,
  passList: [],

  queryParams: {
    popOrCar: 'pop',
    popType: '',
    beginTime: '',
    endTime: '',
    page: 1,
  },

  selectedCommunity: '',
};

export default {
  namespace: 'videoArchives',
  state: {
    ...initState,
  },
  effects: {
    *getPeopleWeek({ payload }, { call, put }) {
      const res = yield call(getPeopleWeek, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          weekFlowList: data,
        },
      });
    },
    *getCarWeek({ payload }, { call, put }) {
      const res = yield call(getCarWeek, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          weekFlowList: data,
        },
      });
    },
    *getPersonPassedBy({ payload }, { call, put }) {
      const res = yield call(getPersonPassedBy, payload);
      const { data } = res;
      if (data) {
        const { total: passTotal, rows } = data;
        yield put({
          type: 'setState',
          payload: {
            passTotal,
            passList: rows.map((item) => ({
              cjtobjectUrl: item.cjtobjectUrl,
              name: item.name,
              pid: item.pid,
              wzbjsj: item.wzbjsj,
              type: item.peopleType,
            })),
          },
        });
      }
    },
    *getVehiclePassedBy({ payload }, { call, put }) {
      const res = yield call(getVehiclePassedBy, payload);
      const { data } = res;
      if (data) {
        const { total: passTotal, rows } = data;
        yield put({
          type: 'setState',
          payload: {
            passTotal,
            passList: rows.map((item) => ({
              cjtobjectUrl: item.cjtobjectUrl,
              name: item.carPlate,
              pid: item.carPlate,
              wzbjsj: item.wzbjsj,
              type: item.carType,
            })),
          },
        });
      }
    },
    *getPersonCount({ payload }, { call, put }) {
      const res = yield call(getPersonCount, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          popCarCount: data,
        },
      });
    },
    *getCarCount({ payload }, { call, put }) {
      const res = yield call(getCarCount, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          popCarCount: data,
        },
      });
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
