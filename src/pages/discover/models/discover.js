import {
  getOrgList,
  getOrgPicByPids,
  getTrajectoryByPidtx,
  getOrgTypeList,
} from '@/services/discover';

const initState = {
  orgTypeList: [],
  selectedOrgType: null,
  orgList: [],
  relationChartData: [],
  peerRecordList: [],
  selectedPeerList: {},
};

export default {
  namespace: 'discover',
  state: {
    ...initState,
  },
  effects: {
    *getOrgList({ payload }, { call, put }) {
      const response = yield call(getOrgList, payload);
      const { data } = response;
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            orgList: data,
          },
        });
      }
    },
    *getOrgPicByPids({ payload }, { call, put }) {
      const response = yield call(getOrgPicByPids, payload);
      const { data } = response;
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            relationChartData: data,
          },
        });
      }
    },
    *getTrajectoryByPidtx({ payload }, { call, put }) {
      const response = yield call(getTrajectoryByPidtx, payload);
      const { data } = response;
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            peerRecordList: data.map((item, index) => ({...item, id: index})),
          },
        });
      }
    },
    *getOrgTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getOrgTypeList, payload);
      const { data, code } = response;
      if(code === 'SUCCESS') {
        yield put({
          type: 'setState',
          payload: {
            orgTypeList: data,
            selectedOrgType: data[0].labelId,
          }
        })
        callback(data[0].labelId);
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
