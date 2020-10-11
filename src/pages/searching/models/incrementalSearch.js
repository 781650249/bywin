// import { message } from 'antd';
import { getAllFaceList, getAllBodyList } from '@/services/previous/videoSearch';

const initState = {
  visible: false,
  bodys: [], // 自动截取的人体
  faces: [], // 自动截取的人脸
  selectedBodyKeys: [],
  selectedFaceKeys: [],
  selectedKeys: [], // 选中的要进行二次检索的图片id
};

export default {
  namespace: 'incrementalSearch',
  state: {
    ...initState,
  },
  effects: {
    *getFaces({ payload = {} }, { call, put, select }) {
      const response = yield call(getAllFaceList, payload);
      const { code, data } = response;
      const { visible } = yield select(
        ({ incrementalSearch }) => incrementalSearch
      );
      if (!visible || !data) return;

      if (code === 'SUCCESS') {
        yield put({
          type: 'setState',
          payload: {
            faces: data,
          },
        });
      }
    },
    *getBodys({ payload }, { call, put, select }) {
      const response = yield call(getAllBodyList, payload);
      const { code, data } = response;
      const { visible } = yield select(
        ({ incrementalSearch }) => incrementalSearch
      );
      if (!visible || !data) return;
      if (code === 'SUCCESS') {
        yield put({
          type: 'setState',
          payload: {
            bodys: data,
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
