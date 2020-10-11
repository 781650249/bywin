import { getStatisticalData, getPeopleFlowTrend, getCarFlowTrend } from '@/services/situation';

const initState = {
  quantity: [],
  community: [],
  careTarget: [],
  behavior: [],
  organization: [],
  peopleFlowTrend: {},
  trafficFlowTrend: {},
};

export default {
  namespace: 'situation',
  state: {
    ...initState,
  },
  effects: {
    *getStatisticalData({ payload }, { call, put }) {
      const res = yield call(getStatisticalData, payload);
      const { data = {} } = res;
      if (data) {
        const {
          caringPersonCount: careTarget,
          behaviorWaringCount: behavior,
          organizationCount: organization,
          otherCount: community,
          ...quantity
        } = data;
        yield put({ type: 'setQuantity', quantity });
        yield put({ type: 'setCareTarget', careTarget });
        yield put({ type: 'setBehavior', behavior });
        yield put({ type: 'setOrganization', organization });
        yield put({ type: 'setCommunity', community });
      }
    },
    *getPeopleFlowTrend({ payload }, { call, put }) {
      const res = yield call(getPeopleFlowTrend, payload);
      const { data = {} } = res;
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            peopleFlowTrend: { ...data },
          },
        });
      }
    },
    *getCarFlowTrend({ payload }, { call, put }) {
      const res = yield call(getCarFlowTrend, payload);
      const { data = {} } = res;
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            trafficFlowTrend: { ...data },
          },
        });
      }
    },
  },
  reducers: {
    setQuantity(state, { quantity }) {
      const {
        todayPeopleCount,
        permanentCount,
        todayVisitorCount,
        keyPersonCount,
        communityVehicleCount,
      } = quantity;
      state.quantity = [
        todayPeopleCount,
        permanentCount,
        todayVisitorCount,
        keyPersonCount,
        communityVehicleCount,
      ];
    },
    setCareTarget(state, { careTarget }) {
      if (Array.isArray(careTarget)) {
        state.careTarget = [...careTarget];
      }
    },
    setBehavior(state, { behavior }) {
      if (Array.isArray(behavior)) {
        state.behavior = [...behavior];
      }
    },
    setOrganization(state, { organization }) {
      if (Array.isArray(organization)) {
        state.organization = [...organization];
      }
    },
    setCommunity(state, { community }) {
      if (Array.isArray(community)) {
        state.community = [...community];
      }
    },

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
