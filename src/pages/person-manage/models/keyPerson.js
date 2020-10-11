import {
  getKeyPersonList,
  addKeyPerson,
  updateKeyPerson,
  deleteKeyPerson,
  getKeyPersonById,
} from '@/services/person-manage';

const initState = {
  page: 1,
  total: 0,
  list: [],
};

export default {
  namespace: 'keyPerson',
  state: {
    ...initState,
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const res = yield call(getKeyPersonList, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          list: data.rows.map((item) => ({
            id: item.id,
            labels: item.warningLabelInfoVO.map((label) => label.labelName),
            imageUrl: item.faceUrl,
            name: item.name,
            phone: item.phone,
            cardid: item.cardId,
            community: item.community,
            floorInfo: item.floorInfo,
          })),
          total: data.total,
        },
      });
      return true;
    },
    *add({ payload = {} }, { call }) {
      const res = yield call(addKeyPerson, payload);
      const { data } = res;
      return data;
    },
    *update({ payload = {} }, { call }) {
      const res = yield call(updateKeyPerson, payload);
      const { data } = res;
      return data;
    },
    *delete({ payload = {} }, { call }) {
      const res = yield call(deleteKeyPerson, payload);
      const { code } = res;
      return code;
    },
    *getInfoById({ payload = {}, callback = () => {} }, { call }) {
      const res = yield call(getKeyPersonById, payload);
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
