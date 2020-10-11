import {
  getStatistics,
  getPeopleCount,
  getStatisticsRange,
  getStaticsPercent,
} from '@/services/personnel/heat-map';

const initState = {
  statisticsCount: [],
  peopleTotal: 0, // 人员总数
  inSideTotal: 0, // 园区人员
  outSideTotal: 0, // 外来人员
  peopleAssignCount: {},
  timeFormat: [],
  insiderCountList: [],
  outsiderCountList: [],
  totalCountList: [],
  AssignData0: [],
  AssignData1: [],
  AssignData2: [],
  queryParams: {
    beginTime: '',
    endTime: '',
    // timeRangeType: '1',
    yqbh: 'cs1',
  },
  doorList: [],
};

export default {
  namespace: 'heatMap',
  state: {
    ...initState,
  },
  effects: {
    *getStatistics({ payload }, { call, put }) {
      const { data } = yield call(getStatistics, payload);
      yield put({
        type: 'setState',
        payload: {
          statisticsCount: data,
        },
      });
    },
    *getPeopleCount({ payload }, { call, put }) {
      const { data } = yield call(getPeopleCount, payload);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            inSideTotal: data.insiderCount,
            peopleTotal: data.totalCount,
            outSideTotal: data.outsiderCount,
          },
        });
      }
    },
    *getStatisticsRange({ payload }, { call, put }) {
      const { data } = yield call(getStatisticsRange, payload);
      if (data) {
        const areaTotal = data.yaxisDataList;
        yield put({
          type: 'setState',
          payload: {
            peopleAssignCount: data,
            AssignData0: areaTotal[0],
            AssignData1: areaTotal[1],
            AssignData2: areaTotal[2],
            timeFormat: data.xaxisData,
          },
        });
      }
      return data;
    },
    *getStaticsPercent({ payload }, { call, put }) {
      const { data } = yield call(getStaticsPercent, payload);
      const doorListFilter = data.barrierList.map((item) => ({
        name: item.substring(0, 10),
        // max: 100,
      }));
      if (doorListFilter) {
        yield put({
          type: 'setState',
          payload: {
            doorList: doorListFilter,
            totalCountList: data.totalCountList,
            outsiderCountList: data.outsiderCountList,
            insiderCountList: data.insiderCountList,
          },
        });
      }
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
