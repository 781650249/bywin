import {
  getCommunityInfo,
  getCommunityList,
  getCameraList,
  putImageByBase64,
  switchDataSource,
} from '@/services/global';

const initState = {
  communityInfo: {
    id: null,
    name: '',
    image: '',
    address: '',
    range: [],
  },
  communityList: [],
  cameraList: [],
};

export default {
  namespace: 'global',
  state: {
    ...initState,
  },
  effects: {
    *getCommunityInfo({ payload }, { call, put }) {
      const { data } = yield call(getCommunityInfo, payload);
      if(Array.isArray(data) && data.length > 0) {
        const communityInfo = {
          id: data[0].communityId,
          name: data[0].communityName,
          image: data[0].communityImage,
          address: data[0].communityAddress,
          range: /^\[/.test(data[0].communityRange) ? JSON.parse(data[0].communityRange) : [],
        };
        yield put({
          type: 'setState',
          payload: {
            communityInfo,
          },
        });
      }
    },
    *getCommunityList({ payload }, { call, put }) {
      const { data } = yield call(getCommunityList, payload);
      yield put({
        type: 'setState',
        payload: {
          communityList: data,
        }
      })
    },
    *getCameraList({ payload }, { call, put }) {
      const { data } = yield call(getCameraList, payload);
      yield put({
        type: 'setState',
        payload: {
          cameraList: data.map((item) => ({
            id: item.id || item.spbfbm,
            address: item.azdd,
            lng: item.gdJd,
            lat: item.gdWd,
            spbfbm: item.spbfbm,
            crossing: item.crossing,
          })),
        },
      });
    },
    *putImageByBase64({ payload, callback = () => {} }, { call }) {
      const imageUrl = yield call(putImageByBase64, payload);
      callback(imageUrl);
      return imageUrl;
    },
    *switchDataSource({ payload, callback = () => {} }, { call }) {
      const res = yield call(switchDataSource, payload);
      const { code } = res;
      callback(code);
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
