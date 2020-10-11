import { getHistoricalTrack } from '@/services/vehicle-file';


const initState = {
  visible: false,
  info: {},
  track: [],
  allTrack: [],
};

export default {
  namespace: 'vehicleFile',
  state: {
    ...initState,
  },
  effects: {

    // *getVehicleInfo({ payload }, { call }) {
    //   const res = yield call(getVehicleInfo, payload);
    //   const { data } = res;
    //   return data
    // },
    *getHistoricalTrack({ payload }, { call, put }) {
      const res = yield call(getHistoricalTrack, payload);
      const { data } = res;
      const rows = data.length > 0 ? data[0].carPlateList : []
      const track = rows.map((item) => ({
        id: item.id,
        pid: item.pid,
        address: item.address,
        time: item.realTime,
        imageUrl: item.fileId,
        fullUrl: item.frameFileId,
        cph: item.carPlate,
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
