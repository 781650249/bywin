import {
  getCameraLists,
} from '@/services/video-archives';

const initState = {
  visible: false,
  cameraList: [],
  selectedCameraKeys: [],
  treeList: []
};

export default {
  namespace: 'relaTimeProtection',
  state: {
    ...initState,
  },
  effects: {
    *getCameraLists({ payload }, { call, put }) {
      const { data } = yield call(getCameraLists, payload);
      yield put({
        type: 'setState',
        payload: {
          cameraList: data,
        },
      });
    }
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
