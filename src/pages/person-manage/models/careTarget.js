import {
  getCareTargetList,
  addCareTarget,
  updateCareTarget,
  deleteCareTarget,
} from '@/services/person-manage';

const initState = {
  page: 1,
  total: 0,
  list: [],
};

export default {
  namespace: 'careTarget',
  state: {
    ...initState,
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const res = yield call(getCareTargetList, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          list: data.rows.reverse().map((item) => ({
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
      const res = yield call(addCareTarget, payload);
      const { data } = res;
      return data;
    },
    *update({ payload = {} }, { call }) {
      const res = yield call(updateCareTarget, payload);
      const { data } = res;
      return data;
    },
    *delete({ payload = {} }, { call }) {
      const res = yield call(deleteCareTarget, payload);
      const { data } = res;
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
