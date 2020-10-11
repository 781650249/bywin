import { message } from 'antd';
import { keys, values } from 'lodash'
import { getCommunityOrg, getListV2, authUserCommunity } from '@/services/global';

const initState = {
  treeData: [],
  parentObj: {
    userList: [],
    total: 0,
    keyword: '',
    page: 1,
  },
  childObj: {
    userList: [],
    total: 0,
    keyword: '',
    page: 1,
  }
};

export default {
  namespace: 'estateBind',
  state: {
    ...initState,
  },
  effects: {
    *getCommunityOrg({ payload }, { call, put }) {
      const { data } = yield call(getCommunityOrg, payload);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            treeData: data,
          },
        });
      }
    },
    *getAuthorizedListV2({ payload }, { call, put, select }) {
      const { data } = yield call(getListV2, payload);
      const { parentObj } = yield select((state) => state.estateBind);
      if (data) {
        const { rows, total } = data;
        yield put({
          type: 'setState',
          payload: {
            parentObj: {
              ...parentObj,
              userList: rows.map((el) => ({
                ...el,
                communityKeys: el.communitySourceList ? el.communitySourceList.map((i) => keys(i).join(',')) : [],
                communityNames: el.communitySourceList ? el.communitySourceList.map((i) => values(i).join(',')) : [],
                key: el.id,
              })),
              total,
            },
          },
        });
      }
    },
    *getAllListV2({ payload }, { call, put, select }) {
      const { data } = yield call(getListV2, payload);
      const { childObj } = yield select((state) => state.estateBind);
      if (data) {
        const { rows, total } = data;
        yield put({
          type: 'setState',
          payload: {
            childObj: {
              ...childObj,
              userList: rows.map((el) => ({
                ...el,
                communityKeys: el.communitySourceList ? el.communitySourceList.map((i) => keys(i).join(',')) : [],
                communityNames: el.communitySourceList ? el.communitySourceList.map((i) => values(i).join(',')) : [],
                key: el.id,
              })),
              total,
            },
          },
        });
      }
    },
    *authUserCommunity({ payload, callback = () => {} }, { call }) {
      const res = yield call(authUserCommunity, payload);
      const { code } = res;
      if(code === 'SUCCESS') {
        message.success('操作成功')
        callback()
      }else {
        message.error('操作失败')
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
