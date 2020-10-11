import { designatePerson, getDetail, getList, saveInfo } from '@/services/realty-manager';
import { getPersonnelList } from '@/services/carManager';

const initState = {
  queryParams: {
    keyWord: '',
    pageNum: 1,
    pageSize: 20,
    startTime: null,
    endTime: null,
    status: null,
    xqxxbz: null,
  },
  repairTotal: 0,
  repairList: [],
  perSonList: [], // 固定获取的通知人员
  repairDetail: {},
};

export default {
  namespace: 'repair',
  state: {
    ...initState,
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const { data } = yield call(getList, payload);
      yield put({
        type: 'setState',
        payload: {
          repairList: data.rows,
          repairTotal: data.total,
        },
      });
    },
    *getDetail({ payload }, { call }) {
      const { data } = yield call(getDetail, payload);
      return data;
    },
    *getPersonnelList({ payload }, { call, put }) {
      const { data } = yield call(getPersonnelList, payload);
      yield put({
        type: 'setState',
        payload: {
          perSonList: data.rows,
        },
      });
    },
    *saveInfo({ payload }, { call }) {
      const data = yield call(saveInfo, payload);
      return data;
    },
    *designatePerson({ payload }, { call }) {
      const data = yield call(designatePerson, payload);
      return data;
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
