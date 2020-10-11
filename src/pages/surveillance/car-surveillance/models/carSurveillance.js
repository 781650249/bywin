const initState = {
  
};

export default {
  namespace: 'carSurveillance',
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
