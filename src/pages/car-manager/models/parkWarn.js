import { getTreesList } from '@/services/video-archives';
import {
  getCarWarnList,
  getPersonnelList,
  saveWarnConfig,
  getWarnConfigByCameraId,
  getCarWarnDetail,
} from '@/services/carManager';
// import { Sxt } from '../icons/utils';

const initState = {
  isWarnParkShow: false,
  treeList: [],
  selectedCameras: [],
  queryParams: {
    beginTime: null,
    endTime: null,
    pageNum: 1,
    pageSize: 10,
    warnStatus: null, // 1 解除 2未解除 //全部 null
  },
  personParams: {
    key: '',
    position: '',
    pageSize: null,
    pageNum: null,
    yqxxbz:''
  },
  carWarnList: [],
  carWarnListTotal: null,
  perSonList: [], // 固定获取的通知人员
  savePeople: [], // 临时保存的通知人员
};

export default {
  namespace: 'parkWarn',
  state: {
    ...initState,
  },
  effects: {
    *getTreesList({ payload }, { call, put }) {
      const { data } = yield call(getTreesList, payload);
      const transfer = (rows, parentKey) =>
        rows.map((item, i) => {
          let key = null;
          if (item) {
            key = i;
          }
          if (parentKey) {
            key = `${parentKey}&${key}`;
          } else {
            key = String(key);
          }
          if (
            Array.isArray(item.monitoringInformationlist)
          ) {
            return {
              key,
              selectable: false,  
              title: item.azdd.substring(0, 12),
              id: item.id,
              children: transfer(item.monitoringInformationlist, key),
            };
          }
          return {
            key,
            title: item.azdd.substring(0, 12),
            isOnline: item.isOnline,
            gdJd: item.gdJd,
            gdWd: item.gdWd,
            id: item.id,
            xqxxbz: item.xqxxbz
            // eslint-disable-next-line react/react-in-jsx-scope
            // icon: () => <Sxt type="icon-shexiangtou1" />,
          };
        });
      yield put({
        type: 'setState',
        payload: {
          treeList: transfer(data),
        },
      });
    },
    *getCarWarnList({ payload }, { call, put }) {
      const { data } = yield call(getCarWarnList, payload);
      const { rows, total } = data;
      yield put({
        type: 'setState',
        payload: {
          carWarnList: rows,
          carWarnListTotal: total,
        },
      });
    },
    *getCarWarnDetail({ payload }, { call }) {
      const { data } = yield call(getCarWarnDetail, payload);
      return data;
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
    *getWarnConfigByCameraId({ payload }, { call }) {
      const { data } = yield call(getWarnConfigByCameraId, payload);
      return data;
    },
    *saveWarnConfig({ payload }, { call }) {
      const { data } = yield call(saveWarnConfig, payload);
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
