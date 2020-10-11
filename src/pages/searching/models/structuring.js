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

function getOptions(list) {
  let obj = {};
  list.forEach((data) => {
    const { options, colum, children } = data;
    if (options && options.length > 0) {
      obj = { ...obj, [colum]: Array.from(options, (s) => s.value) };
    } else if (children && children.length > 0) {
      const o = getOptions(children);
      obj = { ...obj, ...o };
    }
  });
  return obj;
}
async function getSelectOption(list) {
  let obj = {};
  list.forEach((data) => {
    const { options, colum, children } = data;
    if (options && options.length > 0) {
      obj = { ...obj, [colum]: Array.from(options, (s) => s.value) };
    } else if (children && children.length > 0) {
      const o = getOptions(children);
      obj = { ...obj, ...o };
    }
  });
  return obj;
}

function getOptionsLabel(list) {
  let obj = {};
  list.forEach((data) => {
    const { options, colum, children } = data;
    if (options && options.length > 0) {
      const arr = Array.from(options, (s) => ({ [s.value]: s.key }));
      let o = {};
      arr.forEach((p) => {
        o = { ...o, ...p };
      });
      obj = {
        ...obj,
        [colum]: o,
      };
    } else if (children && children.length > 0) {
      const o = getOptionsLabel(children);
      obj = { ...obj, ...o };
    }
  });
  return obj;
}
async function getSelectOptionLabel(list) {
  let obj = {};
  list.forEach((data) => {
    const { options, colum, children } = data;
    if (options && options.length > 0) {
      const arr = Array.from(options, (s) => ({ [s.value]: s.key }));
      let o = {};
      arr.forEach((p) => {
        o = { ...o, ...p };
      });
      obj = {
        ...obj,
        [colum]: o,
      };
    } else if (children && children.length > 0) {
      const o = getOptionsLabel(children);
      obj = { ...obj, ...o };
    }
  });
  return obj;
}

async function getInputLabel(list) {
  const arr = [];
  list.forEach((data) => {
    const { type, colum } = data;
    if (type === 'input') {
      arr.push(colum);
    }
  });
  return arr;
}

export default {
  namespace: 'structuring',
  state: {
    radioValue: '', // 父级选项的值，用来确定次级选项是否展示
    inputObject: {}, // 选择出来的结构化参数（确认的）
    temInputObject: {}, // 选择出来的结构化参数（临时的，未确认的）
    parameterList: [], // 后端返回的结构化表单参数
    parType: 'pic', // 图片搜索 pic 特征搜索 par
    showFeature: false, // 是否显示结构化参数选择界面
    optionsList: {}, // parameterList里的options的集合
    optionsLabelList: {}, // parameterList里的options的label的集合
    InputLabelList: [], // parameterList里的input的label的集合
  },
  effects: {
    *getParameterList({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { parameterList: [], optionsList: {} },
      });
      const resp = yield call(getParameterList, payload);
      const { code, data, message } = resp;
      if (code === 'SUCCESS') {
        const optionsList = yield getSelectOption(data);
        const optionsLabelList = yield getSelectOptionLabel(data);
        const InputLabelList = yield getInputLabel(data);
        yield put({
          type: 'changeState',
          payload: {
            parameterList: data,
            optionsList,
            optionsLabelList,
            InputLabelList,
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
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeStateByHidden(state) {
      return {
        ...state,
        showFeature: true,
        temInputObject: { ...state.inputObject },
      };
    },
    changeFormMap(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeShowFeature(state, { payload }) {
      const { inputObject, temInputObject } = state;
      let object = { ...inputObject };
      if (payload.edit) {
        object = { ...temInputObject };
      }
      return {
        ...state,
        showFeature: false,
        temInputObject: {},
        inputObject: object,
      };
    },
    changeValues(state, { payload }) {
      const { temInputObject } = state;
      const obj = {
        ...temInputObject,
        ...payload,
      };
      if (payload.vehicleId) {
        obj.vehicleId = payload.vehicleId.toUpperCase()
      }
      return {
        ...state,
        temInputObject: obj,
      };
    },
    restore(state, { payload }) {
      const { inputObject } = state;
      const obj = {
        ...inputObject,
        ...payload.inputObject,
      };
      return {
        ...state,
        inputObject: obj,
        parType: payload.parType,
      };
    },
    clear() {
      return {
        radioValue: '',
        inputObject: {},
        temInputObject: {},
        parameterList: [],
        parType: 'pic', // 图片搜索 pic 特征搜索 par
        showFeature: false,
        optionsList: {},
        optionsLabelList: {},
      };
    },
  },
};
