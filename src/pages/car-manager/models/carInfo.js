
import { getCarList, addCarInfo, deleteCarInfo, updateCarInfo, getCompanyList, importCarExcel, getPersonnelByPhone } from '@/services/carManager';

const initState = {
  queryParams: {
    keyWord: '',
    pageNum: 1,
    pageSize: 20
  },
  carTotal: 0,
  carList: [],
  companyList: []
};

export default {
  namespace: 'carInfo',
  state: {
    ...initState
  },
  effects: {
    *getCarList({ payload }, { call, put }) {
      const { data } = yield call(getCarList, payload);
      const { rows, total } = data;
      if (rows) {
        yield put({
          type: 'setState',
          payload: {
            carList: rows,
            carTotal: total,
          }
        })
      }
    },
    *deleteCarInfo({ payload }, { call }) {
      const { code } = yield call(deleteCarInfo, payload)
      return code
    },
    *getCompanyList({ payload }, { call, put }) {
      const { data } = yield call(getCompanyList, payload)
      yield put({
        type: 'setState',
        payload: {
          companyList: data.rows
        }
      })
    },
    *addCarInfo({ payload }, { call }) {
      const { code } = yield call(addCarInfo, payload);
      return code
    },
    *updateCarInfo({ payload }, { call }) {
      const { code } = yield call(updateCarInfo, payload)
      return code
    },
    *importCarExcel({ payload }, { call }) {
      const res = yield call(importCarExcel, payload);
      const { code } = res;
      return code
    },
    *getPersonnelByPhone({ payload }, { call }) {
      const res = yield call(getPersonnelByPhone, payload);
      return res

    }
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    clear() {
      return {
        ...initState
      }
    }
  }
}