import { getPatrolWarnLog } from '@/services/patrol';

const initState = {
  warnRecordList: [],
  totalWarn: 0,
};

export default {
  namespace: 'warnRecord',
  state: {
    ...initState,
  },
  effects: {
    *getPatrolWarnLog({ payload, callback = () => {} }, { call, put, select }) {
      const { data } = yield call(getPatrolWarnLog, payload);
      const { warnRecordList } = yield select(({ warnRecord }) => warnRecord);
      const { page } = payload;
      const { rows, total } = data;
      if (!Array.isArray(rows)) return;
      if (page === 1) {
        yield put({
          type: 'setState',
          payload: {
            warnRecordList: rows.map((item, index) => ({
              ...item,
              coords: item.coords ? JSON.parse(item.coords) : [],
              key: index,
            })),
            totalWarn: total,
          },
        });
      } else {
        yield put({
          type: 'setState',
          payload: {
            warnRecordList: [
              ...warnRecordList,
              ...rows.map((item, index) => ({
                ...item,
                coords: item.coords ? JSON.parse(item.coords) : [],
                key: index,
              })),
            ],
            totalWarn: total,
          },
        });
      }
      callback();
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
