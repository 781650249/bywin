import { getPersonInfo, getVehicleInfo, getHistoricalTrack, getRelationEntity, getTrajectoryByPidtx, getPidBehaviorTrace } from '@/services/profile';

const relationState = {
  gxObject: {},
  peerRecordList: [], // 同行列表
  selectedPeer: {}, // 选中同行内容
  current: 1,
  pageSize: 3,
}

const initState = {
  visible: false,
  info: {},
  track: [],
  allTrack: [],
  behavior: [],
  allBehavior: [],
  ...relationState
};

export default {
  namespace: 'profile',
  state: {
    ...initState,
  },
  effects: {
    *getPersonInfo({ payload }, { call, put }) {
      const res = yield call(getPersonInfo, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          info: data || {},
        },
      });
    },
    *getVehicleInfo({ payload }, { call }) {
      const res = yield call(getVehicleInfo, payload);
      const { data } = res;
      return data
    },
    *getHistoricalTrack({ payload }, { call, put }) {
      const res = yield call(getHistoricalTrack, payload);
      const { data } = res;
      const rows = data.length > 0 ? data[0].modelColleaguesList : []
      const track = rows.map((item) => ({
        id: item.id,
        pid: item.pid,
        address: item.address,
        time: item.wzbjsj,
        imageUrl: item.cjtobjectUrl,
        fullUrl: item.ytobjectUrl,
        lnglat: {
          lng: Number(item.jd),
          lat: Number(item.wd),
        },
        leftTop: {
          x: item.zsjXzb,
          y: item.zsjYzb,
        },
        rightBottom: {
          x: item.yxjXzb,
          y: item.yxjYzb,
        },
      }))
      yield put({
        type: 'setState',
        payload: {
          track,
          allTrack: [...track],
        },
      });
    },
    *getRelationEntity({ payload }, { call, put }) {
      const res = yield call(getRelationEntity, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          gxObject: data,
        },
      });
    },
    *getTrajectoryByPidtx({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(getTrajectoryByPidtx, payload);
      const { data } = response;
      yield put({
        type: 'setState',
        payload: {
          peerRecordList: data.map((item, index) => ({...item, id: index})),
        },
      });
      callback()
    },
    *getPidBehaviorTrace({ payload }, { call, put }) {
      const res = yield call(getPidBehaviorTrace, payload);
      const { data } = res;
      if(data) {
        const allBehavior = data.map((item) => ({
          address: item.address,
          sxtid: item.sxtid,
          cxcs: item.cxcs,
          time: item.modelColleaguesList[0].wzbjsj,
          imageUrl: item.modelColleaguesList[0].cjtobjectUrl,
          lnglat: {
            lng: Number(item.modelColleaguesList[0].jd),
            lat: Number(item.modelColleaguesList[0].wd),
          },
          modelColleaguesList: item.modelColleaguesList.map((child) => ({
            id: child.id,
            sxtid: child.sxtid,
            fullUrl: child.ytobjectUrl,
            imageUrl: child.cjtobjectUrl,
            time: child.wzbjsj,
            leftTop: {
              x: child.zsjXzb,
              y: child.zsjYzb,
            },
            rightBottom: {
              x: child.yxjXzb,
              y: child.yxjYzb,
            },
          })),
        }))
        yield put({
          type: 'setState',
          payload: {
            allBehavior,
          },
        });
      };
    }
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearRelation() {
      return {
        ...initState,
        ...relationState,
      };
    },
    clear() {
      return {
        ...initState,
      };
    },
  },
};
