import { notification } from 'antd';
import { getCameraList, getCameraTypeList, getPoliceStationList } from '@/services/previous/videoSearch';

const initState = {
  cameraList: [], // 摄像头列表
  cameraIdList: [], // 选中的摄像头id
  cameraTypeList: [], // 摄像头类型
  selectedCameraType: [], // 选中的摄像头类型
  policeStationList: [], // 派出所列表
  selectedPoliceStation: [], // 选中的派出所列表
};


export default {
  namespace: 'searchingMap',
  state: {
    ...initState,
  },
  effects: {
    *getCameraList({ payload, callback = () => {} }, { call, put }) {
      yield put({ type: 'searching/setLoading', loading: true });
      const res = yield call(getCameraList, payload);
      yield put({ type: 'searching/setLoading', loading: false });
      const { code, data, message: msg } = res;
      if (code === 'SUCCESS') {
        yield put({
          type: 'setState',
          payload: { cameraList: data },
        });
        callback(data)
      } else {
        notification.error({
          message: '获取摄像头列表失败',
          description: msg,
        });
      }
    },
    *getCameraTypeList({ payload }, { call, put }) {
      const res = yield call(getCameraTypeList, payload)
      const { code, data } = res;
      if (code === 'SUCCESS') {
        yield put({
          type: 'setState',
          payload: {
            cameraTypeList: [...data],
            selectedCameraType: [...data],
          },
        })
      }
    },
    *getPoliceStationList({ payload }, { call, put }) {
      const res = yield call(getPoliceStationList, payload)
      const { code, data } = res;
      if (code === 'SUCCESS') {
        const policeStationList = data.map(el => el.gxdwmc)
        yield put({
          type: 'setState',
          payload: {
            policeStationList,
            selectedPoliceStation: [...policeStationList],
          },
        })

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
    reset(state) {
      return {
        ...state,
        cameraIdList: [],
        selectedCameraType: [...state.cameraTypeList],
        selectedPoliceStation: [...state.policeStationList],
      }
    },
    clear() {
      return {
        ...initState,
      };
    },
  },
};
