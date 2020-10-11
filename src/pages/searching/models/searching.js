
const initState = {
  loading: false,
};

export default {
  namespace: 'searching',
  state: {
    ...initState,
  },
  reducers: {
    setLoading(state, { loading }) {
      return {
        ...state,
        loading,
      };
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
