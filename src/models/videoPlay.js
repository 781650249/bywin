import {
  getLiveVideoUrl,
  getHistoryVideoUrl,
} from '@/services/video-archives';

const initState = {

};

export default {
  namespace: 'videoPlay',
  state: {
    ...initState,
  },
  effects: {
    *getLiveVideoUrl({ payload, callback = () => {} }, { call }) {
      const res = yield call(getLiveVideoUrl, payload);
      const { data } = res;
      callback(data);
    },
    *getHistoryVideoUrl({ payload, callback = () => {} }, { call }) {
      const res = yield call(getHistoryVideoUrl, payload);
      const { data } = res;
      callback(data);
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
