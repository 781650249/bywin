import { disposeEventCount } from '@/services/event-hubs';

const initState = {
  statisticalList: [],
};

export default {
  namespace: 'eventCount',
  state: {
    ...initState,
  },
  effects: {
    *disposeEventCount({ payload }, { call, put }) {
      const res = yield call(disposeEventCount, payload);
      const { data } = res;
      if(data) {
        yield put({
          type: 'setState',
          payload: {
            statisticalList: data,
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