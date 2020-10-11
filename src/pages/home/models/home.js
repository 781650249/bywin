 const initState = {
  communityInfo: { },
  communityList: [],
  cameraList: [],
};

export default {
  namespace: 'home',
  state: {
    ...initState,
  },
  effects: {
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
