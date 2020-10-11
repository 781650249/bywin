import {
  getComeGoList,
  getCommunityList,
  addPersonInfo,
  getZDRYList,
  getPersonnelGatherList,
  getUnmaskList,
  getHighTossActList,
  getLiedownList,
  disposeEvent,
  getPersonInfoByPid,
  updatePersonInfo,
  getBuildingCascade
} from '@/services/event-hubs';

const initState = {
  disposeVisible: false,
  openId: '',
  eventValue: '人员聚集',
  allEventList: [],
  allEventTotal: 0,
  communityList: [], // 小区列表
  personInfo: {},

  queryParams: {
    handelStatus: 'unrecorded',
    startTime: '',
    endTime: '',
    page: 1,
    quitStatus: 'register',
  }
};

export default {
  namespace: 'eventList',
  state: {
    ...initState,
  },
  effects: {
    *getComeGoList({ payload }, { call, put }) {
      const res = yield call(getComeGoList, payload);
      const { data } = res;
      const { total, rows } = data;
      const list = rows.map((item) => ({
        id: item.pid,
        imgUrl: item.cjtobjectUrl,
        address: item.address,
        name: item.name,
        time: item.wzbjsj,
        ytUrl: '',
      }))
      yield put({
        type: 'setState',
        payload: {
          allEventList: list,
          allEventTotal: total,
        },
      });
    },
    *getCommunityList({ payload }, { call, put }) {
      const res = yield call(getCommunityList, payload);
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          communityList: data,
        },
      });
    },
    *addPersonInfo({ payload, callback }, { call }) {
      const res = yield call(addPersonInfo, payload);
      const { code } = res;
      if (code === 'SUCCESS') {
        callback();
      }
    },
    *getZDRYList({ payload }, { call, put }) {
      const res = yield call(getZDRYList, payload);
      const { data } = res;
      const { total, rows } = data;
      const list = rows.map((item) => ({
        id: item.bktid,
        imgUrl: item.cjtid,
        address: item.hdfsdd,
        name: item.name,
        time: item.wzbjsj,
        ytUrl: '',
        customId: item.id,
      }))
      yield put({
        type: 'setState',
        payload: {
          allEventList: list,
          allEventTotal: total,
        },
      });
    },
    *getPersonnelGatherList({ payload }, { call, put }) {
      const res = yield call(getPersonnelGatherList, payload);
      const { data } = res;
      const { total, rows } = data;
      const list = rows.map((item) => ({
        id: item.uid,
        imgUrl: item.ytobjectUrl,
        address: item.address,
        name: '',
        time: item.beginTime,
        ytUrl: item.ytobjectUrl,
      }))
      yield put({
        type: 'setState',
        payload: {
          allEventList: list,
          allEventTotal: total,
        },
      });
    },
    *getUnmaskList({ payload }, { call, put }) {
      const res = yield call(getUnmaskList, payload);
      const { data } = res;
      const { total, rows } = data;
      const list = rows.map((item) => ({
        id: item.pid,
        imgUrl: item.cjtobjectUrl,
        address: item.address,
        name: '',
        time: item.wzbjsj,
        ytUrl: item.ytobjectUrl,
        yxjXzb: item.yxjXzb,
        yxjYzb: item.yxjYzb,
        zsjXzb: item.zsjXzb,
        zsjYzb: item.zsjYzb,
      }))
      yield put({
        type: 'setState',
        payload: {
          allEventList: list,
          allEventTotal: total,
        },
      });
    },
    *getHighTossActList({ payload }, { call, put }) {
      const res = yield call(getHighTossActList, payload);
      const { data } = res;
      const { total, rows } = data;
      const list = rows.map((item) => ({
        id: item.id,
        imgUrl: item.warningImage,
        address: item.warningSite,
        name: '',
        time: item.warningDate,
        ytUrl: item.ytobjectUrl,
        videoUrl: item.videoUrl,
      }))
      yield put({
        type: 'setState',
        payload: {
          allEventList: list,
          allEventTotal: total,
        },
      });
    },
    *getLiedownList({ payload }, { call, put }) {
      const res = yield call(getLiedownList, payload);
      const { data } = res;
      const { total, rows } = data;
      const list = rows.map((item) => ({
        id: item.lieDownVOS[0].uid,
        imgUrl: item.lieDownVOS[0].cjtobjectUrl,
        address: item.lieDownVOS[0].address,
        name: '',
        time: item.lieDownVOS[0].wzbjsj,
        ytUrl: item.lieDownVOS[0].ytobjectUrl,
        yxjXzb: item.lieDownVOS[0].yxjXzb,
        yxjYzb: item.lieDownVOS[0].yxjYzb,
        zsjXzb: item.lieDownVOS[0].zsjXzb,
        zsjYzb: item.lieDownVOS[0].zsjYzb,
      }))
      yield put({
        type: 'setState',
        payload: {
          allEventList: list,
          allEventTotal: total,
        },
      });
    },
    *disposeEvent({ payload, callback }, { call }) {
      const res = yield call(disposeEvent, payload);
      const { code } = res;
      if (code === 'SUCCESS') {
        callback();
      }
    },
    *getPersonInfoByPid({ payload }, { call, put }) {
      const res = yield call(getPersonInfoByPid, payload);
      const { data: personInfo } = res;
      if(personInfo) {
        yield put({
          type: 'setState',
          payload: {
            personInfo
          },
        });
      }
    },
    *updatePersonInfo({ payload, callback }, { call }) {
      const res = yield call(updatePersonInfo, payload);
      const { code } = res;
      if (code === 'SUCCESS') {
        callback();
      }
    },
    *getBuildingCascade({ payload, callback = () => {} }, { call }) {
      const { data } = yield call(getBuildingCascade, payload);
      if(data) {
        const roomList = data.map((a) => ({
          value: a.id,
          label: a.name,
          children: a.unitList.map((b) => ({
            value: b.id,
            label: b.name,
            children: b.houseList.map((c) => ({
              value: c.id,
              label: c.name,
            }))
          }))
        }))
        callback(roomList);
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
