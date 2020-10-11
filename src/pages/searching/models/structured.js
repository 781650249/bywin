import { notification } from 'antd';
import request from '@/utils/previous/request';
import URL from '@/utils/previous/request/url';

async function getParameterList(params) {
  return request({
    url: URL.GET_ATTRIBUTE_PARAMETER_LIST,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

const initState = {
  show: false,
  formItems: [],
  formData: {},
  fields: [],
};

export default {
  namespace: 'structured',
  state: {
    ...initState,
  },
  effects: {
    *getParameterList({ payload }, { call, put }) {
      const res = yield call(getParameterList, payload);
      const { code, data: formItems, message } = res;
      if (code === 'SUCCESS') {
        yield put({
          type: 'setState',
          payload: {
            formItems,
          },
        });
      } else {
        notification.warn({
          message: '获取特征参数失败',
          description: message,
          style: {
            zIndex: 3000,
          },
        });
      }
    },
  },
  reducers: {
    setFormData(state, { formData }) {
      state.formData = formData;
    },
    setFields(state, { fields }) {
      state.fields = fields;
    },

    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset(state) {
      return {
        ...initState,
        formItems: state.formItems,
      }
    },
    clear() {
      return {
        ...initState,
      };
    },
  },
};
