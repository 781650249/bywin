import { message } from 'antd';
import { getFaceList } from '@/services/previous/videoSearch';

const initState = {
  loading: false,
  cropperVisible: false,
  viewVisible: false,
  image: '',
  allBodys: [], // 所有的人体
  allFaces: [], // 所有的人脸
  // selectedBodys: [], // 选中的人体
  // selectedFaces: [], // 选中的人脸
};

export default {
  namespace: 'pictureUpload',
  state: {
    ...initState,
  },
  effects: {
    *getBodyAndFace({ payload = {} }, { call, put }) {
      const response = yield call(getFaceList, payload);
      const { code, data, message: msg } = response;
      if (code === 'SUCCESS') {
        const { face = [], body = [] } = data;
        const allFaces = face
          .filter((v) => v.cjtid)
          .map((v, i) => ({ key: `face-${new Date().valueOf()}-${i}`, image: v.cjtid }));
        const allBodys = body
          .filter((v) => v.cjtid)
          .map((v, i) => ({ key: `body-${new Date().valueOf()}-${i}`, image: v.cjtid }));
        yield put({
          type: 'setState',
          payload: {
            allFaces,
            allBodys,
          },
        });
      } else {
        message.error(msg);
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
