import {
  addAnnouncement,
  delNotice,
  getNotice,
  saveNotice,
  updateNotice,
  getManageList,
  getTypeList,
  getBuilding,
  getPersonnelList,
  saveAnnoucement,
  deleteAnnounceMent,
  getAnnouncementDetail,
  updateAnnounceMent,
} from '@/services/realty-manager';

const initState = {
  temParams: {
    keyword: '',
    pageNum: 1,
    pageSize: 10,
  },
  temList: [],
  temListTotal: 0,
  typeList: [],
  queryParams: {
    communityId: null,
    endDate: null,
    keyword: '',
    pageNum: null,
    pageSize: null,
    startDate: null,
  },
  mangerList: [],
  mangerListTotal: 0,
  buildingList: [],
  ldxxbz: '',
  detailList: [],
  personParams: {
    key: '',
    position: '',
    pageSize: null,
    pageNum: null,
    yqxxbz: '',
  },
};

export default {
  namespace: 'notice',
  state: {
    ...initState,
  },
  effects: {
    *getManageList({ payload }, { call, put }) {
      const { data } = yield call(getManageList, payload);
      yield put({
        type: 'setState',
        payload: {
          mangerList: data.rows,
          mangerListTotal: data.total,
        },
      });
    },
    *deleteAnnounceMent({ payload }, { call }) {
      const data = yield call(deleteAnnounceMent, payload);
      return data;
    },
    *delNotice({ payload }, { call }) {
      const data = yield call(delNotice, payload);
      return data;
    },
    *saveAnnoucement({ payload }, { call }) {
      const data = yield call(saveAnnoucement, payload);
      return data;
    },
    *updateAnnounceMent({ payload }, { call }) {
      const data = yield call(updateAnnounceMent, payload);
      return data;
    },

    *getNotice({ payload }, { call, put }) {
      const { data } = yield call(getNotice, payload);
      yield put({
        type: 'setState',
        payload: {
          temList: data.rows,
          temListTotal: data.total,
        },
      });
    },
    *saveNotice({ payload }, { call }) {
      const data = yield call(saveNotice, payload);
      return data;
    },
    *updateNotice({ payload }, { call }) {
      const data = yield call(updateNotice, payload);
      return data;
    },
    *addAnnouncement({ payload }, { call }) {
      const data = yield call(addAnnouncement, payload);
      return data;
    },

    *getAnnouncementDetail({ payload }, { call,put }) {
      const { data } = yield call(getAnnouncementDetail, payload);
      yield put({
        type:'setState',
        payload:{
          detailList: data
        }
      })
      return data;
    },
    *getBuilding({ payload }, { call, put }) {
      const { data } = yield call(getBuilding, payload);
      const buildingFilter = data.map((item) => ({
        label: item.ldmc,
        id: item.ldxxbz,
        value: item.ldmc,
      }));
      yield put({
        type: 'setState',
        payload: {
          buildingList: buildingFilter,
        },
      });
    },
    *getPersonnelList({ payload }, { call, put }) {
      const { data } = yield call(getPersonnelList, payload);
      const { rows } = data;
      const filterList = rows.map((item) => ({
        positionName: item.positionName,
        qymc: item.qymc,
        sjhm: item.sjhm,
        xbmc: item.xbmc,
        xm: item.xm,
        xp: item.xp,
        ygxxbz: item.ygxxbz,
        key: item.ygxxbz,
        dz: item.dz,
      }));
      yield put({
        type: 'setState',
        payload: {
          perSonList: filterList,
        },
      });
    },

    *getTypeList({ payload }, { call, put }) {
      const { data } = yield call(getTypeList, payload);
      yield put({
        type: 'setState',
        payload: {
          typeList: data,
        },
      });
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
