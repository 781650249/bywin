import { message, notification } from 'antd';
import {
  getCaseNameList,
  getGdId,
  updateStudy,
  saveStudy,
  getRecordList,
} from '@/services/previous/addRecord';
import { responseCode } from '@/utils/previous/request';

const { SUCCESS } = responseCode;
export default {
  namespace: 'addRecord',
  state: {
    visible: false,
    caseNameList: [],
    caseName: '狗屎',
    tabs: '1',
    record: null,
    recordTableLoading: false,
    recordList: [],
    page: 1,
    total: 0,
    addLoading: false,
  },
  effects: {
    *changeCurrent({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { recordTableLoading: true },
      });
      const resp = yield call(getRecordList, payload);
      const { code, data } = resp;
      if (code === SUCCESS) {
        yield put({
          type: 'changeState',
          payload: {
            recordList: data.list,
            recordTableLoading: false,
            total: data.total,
            page: payload.pageNum,
          },
        });
      } else {
        yield put({
          type: 'changeState',
          payload: { recordTableLoading: false },
        });
      }
    },
    *getCaseNameList({ payload }, { call, put }) {
      const resp = yield call(getCaseNameList, payload);
      const { code, data } = resp;
      if (code === SUCCESS) {
        yield put({ type: 'changeState', payload: { caseNameList: data } });
      } else {
        notification.error({
          message: '获取关联案件警情失败',
          description: resp.message,
        });
      }
    },
    *getGdId({ payload, callback }, { call, put }) {
      yield put({ type: 'changeState', payload: { visible: false } });
      yield put({ type: 'cluesForm/changeState', payload: { spinning: true } });
      const { actionName, videoReseachName } = payload;
      const par = { actionName, videoReseachName };
      const resp = yield call(getGdId, par);
      const { data } = resp;
      if (data) {
        callback({ ...payload, id: data });
        yield put({
          type: 'cluesForm/changeState',
          payload: { spinning: false },
        });
      } else {
        callback(null, true);
        yield put({
          type: 'saveStudy',
          payload: { ...payload },
        });
        yield put({
          type: 'cluesForm/changeState',
          payload: { spinning: false },
        });
      }
    },
    *updateStudy({ payload, callback }, { call, put }) {
      yield put({ type: 'changeState', payload: { visible: false } });
      yield put({ type: 'cluesForm/changeState', payload: { spinning: true } });
      const res = yield call(updateStudy, payload);
      if (res.code === SUCCESS) {
        message.success('更新成功');
        yield put({
          type: 'cluesForm/changeState',
          payload: { spinning: false },
        });
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '更新失败',
          description: res.message,
        });
        yield put({
          type: 'cluesForm/changeState',
          payload: { spinning: false },
        });
      }
    },
    *saveStudy({ payload }, { call, put }) {
      yield put({ type: 'changeState', payload: { visible: false } });
      yield put({ type: 'cluesForm/changeState', payload: { spinning: true } });
      const res = yield call(saveStudy, payload);
      if (res.code === SUCCESS) {
        message.success('保存成功');
        yield put({
          type: 'cluesForm/changeState',
          payload: { spinning: false },
        });
      } else {
        notification.error({
          message: '保存失败',
          description: res.message,
        });
        yield put({
          type: 'cluesForm/changeState',
          payload: { spinning: false },
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
    clear() {
      return {
        visible: false,
        caseNameList: [],
        tabs: '1',
        record: null,
        recordTableLoading: false,
        recordList: [],
        page: 1,
        total: 0,
        addLoading: false,
      };
    },
  },
};
