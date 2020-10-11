import { isEqual } from 'lodash';
import {
  getCameraList,
  getPersonPassedBy,
  getVehiclePassedBy,
} from '@/services/video-archives';

const initState = {
  visible: false,
  cameraList: [],
  selectedCameraKeys: [],
  allList: {
    person: {
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
    },
    vehicle: {
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
    },
  },
};

export default {
  namespace: 'videoModal',
  state: {
    ...initState,
  },
  effects: {
    *getCameraList({ payload }, { call, put }) {
      const res = yield call(getCameraList, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          cameraList: data,
        },
      });
    },
    *getPersonPassedBy({ payload, callback = () => {} }, { call, select, put }) {
      const res = yield call(getPersonPassedBy, payload);
      const { rows: data, total } = res.data;
      const { page, size: pageSize } = payload;
      const { selectedCameraKeys } = yield select(({ videoModal }) => videoModal);
      if (isEqual(payload.sxtids, selectedCameraKeys)) {
        yield put({
          type: 'setList',
          payload: {
            person: {
              page,
              pageSize,
              total,
              data,
            },
          },
        });
      }
      callback(data);
    },
    *getVehiclePassedBy({ payload, callback = () => {} }, { call }) {
      const res = yield call(getVehiclePassedBy, payload);
      const { data } = res;
      callback(data);
    },
  },
  reducers: {
    setList(state, { payload }) {
      const { allList } = state;
      state.allList = {
        ...allList,
        ...payload,
      };
    },
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
