
import { getBarrierTree, getWhiteList, getCarToWhite, deleteCarFromWhite, getRecordList, getCarList } from '@/services/carManager';

const initState = {
    whiteCarsList: [],
    notWhiteCarsList: [],
    passRecordList: [],
    passRecordListTotal: '',
    carsTotal: '',
    queryParams: {
        barrierId: '',
        keyWord: '',
        pageNum: 1,
        pageSize: 10
    },
    listRecordParams: {
        barrierId: '',
        carType: '',
        inOutType: "",
        keyWord: '',
        pageNum: 1,
        pageSize: 10
    }
};

export default {
    namespace: 'passingControl',
    state: {
        ...initState
    },
    effects: {
        *getBarrierTree({ payload }, { call, put }) {
            const { data } = yield call(getBarrierTree, payload);
            const { barrierInfoList, xqmc, xqxxbz } = data
            if (data) {
                yield put({
                    type: 'setState',
                    payload: {
                        barrierTreeList: barrierInfoList,
                        xqbz: xqmc,
                        xqbzId: xqxxbz
                    }
                })
            }
        },
        
        *getWhiteList({ payload }, { call, put }) {
            const { data } = yield call(getWhiteList, payload)
            const { rows, total } = data;
            yield put({
                type: 'setState',
                payload: {
                    whiteCarsList: rows,
                    carsTotal: total
                }
            })
        },
        *getCarList({ payload }, { call, put }) {
            const { data } = yield call(getCarList, payload)
            const { rows } = data
            const filteList = rows.map((item) => ({
                address: item.address,
                carNumber: item.carNumber,
                carOwner: item.carOwner,
                companyName: item.companyName,
                phoneNumber: item.phoneNumber,
                id: item.id,
                key: item.id
            }))
            yield put({
                type: 'setState',
                payload: {
                    notWhiteCarsList: filteList
                }
            })
        },
        *getCarToWhite({ payload }, { call }) {
            const data = yield call(getCarToWhite, payload)
            return data
        },
        *deleteCarFromWhite({ payload }, { call }) {
            const res = yield call(deleteCarFromWhite, payload);
            const { code } = res
            return code
        },
        *getRecordList({ payload }, { call, put }) {
            const { data } = yield call(getRecordList, payload);
            const { total, rows } = data
            yield put({
                type: 'setState',
                payload: {
                    passRecordList: rows,
                    passRecordListTotal: total
                }
            })
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