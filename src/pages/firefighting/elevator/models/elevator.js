import {
  getElevatorTree,
  getListOperationInfo,
  getListWarnRecord,
  getElevatorInfo,
} from '@/services/elevator';

const initState = {
  elevatorTreeList: [],
  elevatorList: [],
  elevatorTotal: 0,
  elevatorWarnList: [],
  elevatorWarnTotal: 0,
  elevatorBasicInfo: {},
};

export default {
  namespace: 'elevator',
  state: {
    ...initState,
  },
  effects: {
    *getElevatorTree({ payload }, { call, put }) {
      const { data } = yield call(getElevatorTree, payload);
      const traversal = (array, parentKey, floorList = []) =>
        array.map((item) => {
          let key = null;
          let disabled = true;
          if (item.id) {
            key = item.id;
          } else if (item.xqxxbz) {
            key = item.xqxxbz;
          } else if (item.ldxxbz) {
            key = item.ldxxbz;
            disabled = false;
          } else if (item.elevatorId) {
            key = item.elevatorId;
            disabled = false;
          } else {
            key = null;
          }
          if (parentKey) {
            key = `${parentKey}-${key}`;
          } else {
            key = String(key);
          }
          // if (Array.isArray(item.children) && item.children.length > 0) {
          //   return {
          //     key,
          //     title: item.name,
          //     disabled,
          //     children: traversal(item.children, key, floorList),
          //   };
          // }
          if (Array.isArray(item.children) && item.children.length > 0) {
            return {
              key,
              title: item.name,
              disabled,
              floorList: item.lc || [],
              children: traversal(item.children, key, item.lc || []),
            };
          }
          return {
            key,
            floorList,
            title: item.name,
          };
        });
      yield put({
        type: 'setState',
        payload: {
          elevatorTreeList: traversal(data),
        },
      });
    },
    *getListOperationInfo({ payload }, { call, put }) {
      const { data } = yield call(getListOperationInfo, payload);
      const { rows, total } = data;
      yield put({
        type: 'setState',
        payload: {
          elevatorList: rows || [],
          elevatorTotal: total || 0,
        },
      });
    },
    *getListWarnRecord({ payload, callback = () => {} }, { call, put, select }) {
      const { data } = yield call(getListWarnRecord, payload);
      const { rows, total } = data;
      const { elevatorWarnList } = yield select(({ elevator }) => elevator);
      const { pageNum } = payload;
      if (!Array.isArray(rows)) return;
      if (pageNum === 1) {
        yield put({
          type: 'setState',
          payload: {
            elevatorWarnList: rows,
            elevatorWarnTotal: total,
          },
        });
      } else {
        yield put({
          type: 'setState',
          payload: {
            elevatorWarnList: [...elevatorWarnList, ...rows],
            elevatorWarnTotal: total,
          },
        });
      }
      callback();
    },
    *getElevatorInfo({ payload }, { call, put }) {
      const { data } = yield call(getElevatorInfo, payload);
      if(data) {
        yield put({
          type: 'setState',
          payload: {
            elevatorBasicInfo: data,
          }
        })
      }
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
