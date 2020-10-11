import {
  getEmployeeList,
  getModelArithmeticList,
  getPatrolLineById,
  editPatrolLine,
  deletePatrolLine,
  getPatrolCameraList,
} from '@/services/patrol';

const initState = {
  editMode: 'add', //  编辑方式  add新增 update更新
  editLineId: null, // 编辑线路的id
  editLineDetail: {},
  employeeList: [],
  eventList: [], // 事件列表
  cameraList: [], // 巡逻点列表
};

export default {
  namespace: 'editPatrol',
  state: {
    ...initState,
  },
  effects: {
    *getEmployeeList({ payload }, { call, put }) {
      const { data } = yield call(getEmployeeList, payload);
      if (data) {
        const { rows } = data;
        yield put({
          type: 'setState',
          payload: {
            employeeList: rows.map((item, index) => ({
              num: index + 1,
              ...item,
              key: item.xcygxxbz,
              sex: item.xbdm === '1' ? '男' : '女',
            })),
          },
        });
      }
    },
    *getModelArithmeticList({ payload }, { call, put }) {
      const { data } = yield call(getModelArithmeticList, payload);
      if (data) {
        const { rows } = data;
        yield put({
          type: 'setState',
          payload: {
            eventList: [...rows],
          },
        });
      }
    },
    *getPatrolLineById({ payload }, { call, put }) {
      const { data } = yield call(getPatrolLineById, payload);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            editLineDetail: data,
          },
        });
      }
    },
    *editPatrolLine({ payload, callback = () => {} }, { call }) {
      const response = yield call(editPatrolLine, payload);
      const { code } = response;
      if (code === 'SUCCESS') {
        callback();
      }
    },
    *deletePatrolLine({ payload, callback = () => {} }, { call }) {
      const response = yield call(deletePatrolLine, payload);
      const { code } = response;
      if (code === 'SUCCESS') {
        callback();
      }
    },
    *getPatrolCameraList({ payload }, { call, put }) {
      const {data} = yield call(getPatrolCameraList, payload);
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
