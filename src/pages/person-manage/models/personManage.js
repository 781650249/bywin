import { message } from 'antd';
import { getCommunityList, getBuildingCascade } from '@/services/event-hubs';
import {
  getKeyPersonWarningRuleList,
  getKeyPersonTagList,
  getCareTargetWarningRuleList,
  getCareTargetTagList,
  addKeyPersonTag,
  addCareTargetTag,
  deleteKeyPersonTag,
  deleteCareTargetTag,
} from '@/services/person-manage';

const initState = {
  visible: false,
  currentKey: 'keyPerson',
  communityList: [],
  warningRuleList: [],
  tagList: [],
};

export default {
  namespace: 'personManage',
  state: {
    ...initState,
  },
  effects: {
    *getCommunityList(_, { call, put }) {
      const res = yield call(getCommunityList);
      const { data } = res;
      const communityList = data.map((item) => ({
        key: item.communityId,
        text: item.communityName,
      }));
      yield put({
        type: 'setState',
        payload: { communityList },
      });
      return communityList;
    },
    *getWarningRule(_, { call, put, select }) {
      const { currentKey } = yield select(({ personManage }) => personManage);
      const res = yield call(
        currentKey === 'keyPerson' ? getKeyPersonWarningRuleList : getCareTargetWarningRuleList,
      );
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          warningRuleList: data.map((item) => ({ key: item.labelId, text: item.labelName })),
        },
      });
      return data;
    },
    *getTagList(_, { call, put, select }) {
      const { currentKey } = yield select(({ personManage }) => personManage);
      const res = yield call(
        currentKey === 'keyPerson' ? getKeyPersonTagList : getCareTargetTagList,
      );
      const { data } = res;
      yield put({
        type: 'setState',
        payload: {
          tagList: data.map((item) => ({ key: item.labelId, text: item.labelName })),
        },
      });
      return data;
    },
    *addTag({ payload }, { call, put, select }) {
      const { currentKey } = yield select(({ personManage }) => personManage);
      const res = yield call(
        currentKey === 'keyPerson' ? addKeyPersonTag : addCareTargetTag,
        payload,
      );
      yield put({
        type: 'getTagList',
      });
      return res.data;
    },
    *deleteTag({ payload }, { call, put, select }) {
      try {
        const { currentKey } = yield select(({ personManage }) => personManage);
        const res = yield call(
          currentKey === 'keyPerson' ? deleteKeyPersonTag : deleteCareTargetTag,
          payload,
        );
        message.success('删除成功！');
        yield put({
          type: 'getTagList',
        });
        return res.data;
      } catch (error) {
        message.error('删除失败！');
        return error;
      }
    },
    *getBuildingCascade({ payload, callback = () => {} }, { call }) {
      const { data } = yield call(getBuildingCascade, payload);
      if(data) {
        const roomList = data.map((a) => ({
          value: a.id,
          label: a.name,
          children: a.unitList.map((b) => ({
            value: b.id,
            label: b.name,
            children: b.houseList.map((c) => ({
              value: c.id,
              label: c.name,
            }))
          }))
        }))
        callback(roomList);
      }
    }
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
