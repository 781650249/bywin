
const initState = {
  visible: false,
  content: [],
  faceContent: [],
  selectedContent: [],
  selectedFaceContent: [],
};

export default {
  namespace: 'reconfirm',
  state: {
    ...initState,
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
