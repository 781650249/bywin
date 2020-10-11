import { message } from 'antd';
import {
  getBuildings,
  getPersonnelCount,
  getUnitList,
  getPersonnelInfoByHouse,
  eidtPersonnelInfo,
  getPersonnelById,
  deletePersonnelInfo,
  getHouseInfo,
  getCompanyList,
} from '@/services/community';

const initState = {
  buildingList: [],
  personnelCount: [
    {
      name: '总人口',
      count: 0,
      color: '#71A4FF',
    },
    {
      name: '常住人口',
      count: 0,
      color: '#5BC86D',
    },
    {
      name: '暂住人口',
      count: 0,
      color: '#F4BD4E',
    },
    {
      name: '重点人口',
      count: 0,
      color: '#F46464',
    },
  ],
  unitList: [],
  personnelInfoList: [],

  selectedBuilding: '',  // 选中楼宇
  unitKey: '', // 选中单元
  houseKey: '', // 选中房号

  xqxxbz: null, // 小区信息标志(用于添加人员)
  fwxxbz: null, // 房屋信息标志(用于添加人员)
  currentPersonInfo: {}, // 编辑时的人员详细信息

  hourseInfoList: {}, // 房屋信息
  unitInfoList: {},
};

export default {
  namespace: 'communityDetail',
  state: {
    ...initState,
  },
  effects: {
    *getBuildings({ payload }, { call, put }) {
      const { data } = yield call(getBuildings, payload);
      if (Array.isArray(data) && data.length > 0) {
        yield put({
          type: 'setState',
          payload: {
            buildingList: data,
            selectedBuilding: data[0].ldxxbz,
          },
        });
      }
    },
    *getPersonnelCount({ payload }, { call, put }) {
      const { data } = yield call(getPersonnelCount, payload);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            personnelCount: [
              {
                name: '总人口',
                count: data.zs,
                color: '#71A4FF',
              },
              {
                name: '常住人口',
                count: data.cz,
                color: '#5BC86D',
              },
              {
                name: '暂住人口',
                count: data.zz,
                color: '#F4BD4E',
              },
              {
                name: '重点人口',
                count: data.zdr,
                color: '#F46464',
              },
            ],
          },
        });
      }
    },
    *getUnitList({ payload }, { call, put }) {
      const { data } = yield call(getUnitList, payload);
      const unitList = [...data];

      if (Array.isArray(unitList) && unitList.length > 0) {
        yield put({
          type: 'setState',
          payload: {
            unitList,
            unitKey: unitList[0].dyxxbz,
            xqxxbz: unitList[0].xqxxbz,
          },
        });
        // 判断是否有单元
        if (
          Array.isArray(unitList[0].floorList) &&
          unitList[0].floorList.length > 0 &&
          Array.isArray(unitList[0].floorList[0].houseList) &&
          unitList[0].floorList[0].houseList.length > 0
        ) {
          yield put({
            type: 'setState',
            payload: {
              houseKey: unitList[0].floorList[0].houseList[0].fwbh,
              fwxxbz: unitList[0].floorList[0].houseList[0].fwxxbz,
            },
          });
        }
      }
    },
    *getPersonnelInfoByHouse({ payload }, { call, put }) {
      const { data } = yield call(getPersonnelInfoByHouse, payload);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            personnelInfoList: data,
          },
        });
      }
    },
    *eidtPersonnelInfo({ payload, callback }, { call }) {
      const res = yield call(eidtPersonnelInfo, payload);
      const { code } = res;
      if(code === 'SUCCESS') {
        message.success('操作成功');
        callback();
      }else {
        message.error('操作失败');
      }
    },
    *getPersonnelById({ payload }, { call, put }) {
      const { data } = yield call(getPersonnelById, payload);
      if(data) {
        yield put({
          type: 'setState',
          payload: {
            currentPersonInfo: data
          }
        })
      }
    },
    *deletePersonnelInfo({ payload, callback = () => {} }, { call }) {
      const res = yield call(deletePersonnelInfo, payload);
      const { code } = res;
      if(code === 'SUCCESS') {
        message.success('操作成功');
        callback();
      }else {
        message.error('操作失败');
      }
    },
    *getHouseInfo({ payload }, { call, put }) {
      const res = yield call(getHouseInfo, payload);
      const { data } = res;
      if(Array.isArray(data)) {
        yield put({
          type: 'setState',
          payload: {
            hourseInfoList: data.length > 0 ? data[0] : {}
          }
        })
      }
    },
    *getCompanyList({ payload }, { call, put }) {
      const res = yield call(getCompanyList, payload);
      const { data } = res;
      if(Array.isArray(data)) {
        yield put({
          type: 'setState',
          payload: {
            unitInfoList: data.length > 0 ? data[0] : {}
          }
        })
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
