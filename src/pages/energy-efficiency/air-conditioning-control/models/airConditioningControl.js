import { getList, update, getTreeData } from '@/services/air-conditioning-control';

const initState = {
  currentArea: {},
  treeData: [],
  deviceList: [],
  deviceListAvgValue: {},
};

export default {
  namespace: 'airConditioningControl',
  state: {
    ...initState,
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const res = yield call(getList, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          deviceList: data.rows,
          currentArea: { ...payload },
        },
      });
      return data.row;
    },
    *update({ payload }, { call}) {
      try {
        yield call(update, payload);
        // const { currentArea } = yield select((state) => state.airConditioningControl);
        // yield put({
        //   type: 'getList',
        //   payload: {
        //     ...currentArea,
        //   },
        // });
        return true;
      } catch (error) {
        return false
      }

    },
    *getTreeData({ payload }, { call, put }) {
      const res = yield call(getTreeData, payload);
      const { data } = res;
      const traversal = (array, parentKey) =>
        array.map((item) => {
          let key = null;
          if (item.xqxxbz) {
            key = item.xqxxbz;
          } else if (item.id) {
            key = item.id;
          } else if (item.ldxxbz) {
            key = item.ldxxbz;
          } else if (item.lch) {
            key = item.lch;
          } else {
            key = item.title;
          }
          if (parentKey) {
            key = `${parentKey}&${key}`;
          } else {
            key = String(key);
          }
          if (Array.isArray(item.children) && item.children.length > 0) {
            return {
              key,
              title: item.title,
              children: traversal(item.children, key),
            };
          }
          return {
            key,
            title: item.title,
          };
        });
      yield put({
        type: 'setState',
        payload: {
          treeData: traversal(data),
        },
      });
      return data;
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
