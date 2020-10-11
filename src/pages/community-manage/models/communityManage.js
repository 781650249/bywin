import { getOrgTree, getInfoByTree, importCommunityExcel } from '@/services/community';

const initState = {
  orgTreeList: [],
  activeTabKey: [],
  checkedKeys: [],
  communityList: [],
};

export default {
  namespace: 'communityManage',
  state: {
    ...initState,
  },
  effects: {
    *getOrgTree({ payload, callback }, { call, put }) {
      const { data } = yield call(getOrgTree, payload);
      if(data) {
        yield put({
          type: 'setState',
          payload: {
            orgTreeList: data,
            activeTabKey: data.map(el => el.orgCode)
          },
        });
        callback(data);
      }
    },
    *getInfoByTree({ payload }, { call, put }) {
      const { data } = yield call(getInfoByTree, payload);
      if(data) {
        yield put({
          type: 'setState',
          payload: {
            communityList: data,
          },
        });
      }
    },
    *importCommunityExcel({ payload, callback }, { call }) {
      const res = yield call(importCommunityExcel, payload);
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