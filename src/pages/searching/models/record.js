import { notification, message } from 'antd';
import moment from 'moment';
import { orderBy } from 'lodash';
import { saveAs } from 'file-saver';
import logger from '@/utils/logger';
import {
  startFaceJudegement,
  getFaceJudegementResult,
  setTop,
  getRecordById,
  deleteRecord,
  getTableData,
  merge,
  putOssByBase64,
  updateStudy,
  download,
  exportDownload,
  zipPackAgeStatus,
} from '@/services/previous/record/record';

function jsonParse(data, type) {
  const value = data[type];
  const result = { ...data };
  if (value) {
    result[type] = value.indexOf('{') !== -1 ? JSON.parse(value) : [];
  }
  return result;
}

function editContent(imgs) {
  if (Array.isArray(imgs)) {
    const arr = imgs.map((v) => (v.match(/;base64,/) ? v : `data:image/jpeg;base64,${v}`));
    return arr;
  }
  const list = imgs ? imgs.split(',') : [];
  return list.map((v) => `data:image/jpeg;base64,${v}`);
}

const initState = {
  tablePage: 1,
  tablePageSize: 10,
  tableTotal: 0,
  tableLoading: false,
  dataSource: [],
  exportIdAndState: {}, // 导出状态,id对应状态
  recordVisible: false,
  searchLoading: false,
  searchParams: {}, // 上一次获取历史档案请求的参数
  selectedRowKeys: [], // 表格中选中的行的key
  selectedRows: [], // 表格中选中的行
  noNext: true, // 历史档案还原后不提供图搜结构化搜索翻页功能，为true时不能翻页
  addBase64Loading: false, // 添加图片转http时转圈圈
  EditRecordVisible: false, // 编辑档案的Model弹窗
  EditRecordData: {}, // 用于存储编辑档案的数据
  conditions: '', // 用于存储纬度数据
  personInfoList: [], // 研判结果列表数据

  /**
   * 导出
   * 当前项id 窗口出否可见 选中要导出的类型
   */
  exportKey: '',
  exportVisible: false,
  exportContent: ['img', 'video', 'concatTsVideo', 'word'],
};

export default {
  namespace: 'record',

  state: {
    ...initState,
  },

  effects: {
    *restore({ payload }, { put }) {
      const { details, conditions } = payload;
      /**
       * 清空mac碰撞
       */
      yield put({ type: 'macImpact/clear' });

      let cluesObj = {
        searchType: 'person',
        content: [],
        originalPicture: [],
        startTime: moment(),
        endTime: moment(),
      };
      let inputObject = {};
      /**
       * 获取结构化表单
       */
      const { searchType } = conditions;
      if (searchType) {
        yield put({
          type: 'structuring/getParameterList',
          payload: { searchType },
        });
      }
      Object.keys(conditions).forEach((p) => {
        // console.log(p)
        if (conditions[p] === null || conditions[p] === undefined) return;
        if (['prevImages', 'current', 'keyValue', 'selectedMultipleSearch'].includes(p)) return;

        const inputObjectFilter = [
          'pageNum',
          'ids',
          'urls',
          'idsType',
          'parType',
          'region',
          'cameraIds',
          'areaCount',
        ];
        if (cluesObj[p] || cluesObj[p] === '') {
          cluesObj = {
            ...cluesObj,
            [p]: conditions[p],
          };
          if (p === 'content' || p === 'originalPicture') {
            if (p === 'content' && conditions[p] && Array.isArray(conditions[p])) {
              cluesObj = {
                ...cluesObj,
                [p]: conditions[p],
              };
            } else if (p === 'content' && !conditions[p]) {
              cluesObj = {
                ...cluesObj,
                [p]: [],
              };
            } else {
              cluesObj = {
                ...cluesObj,
                [p]: editContent(conditions[p]),
              };
            }
          }
          if (p === 'cameraIds') {
            /**
             * 感觉没什么用，又不好删
             */
            let cameraIds = '';
            if (conditions[p] && conditions[p].length > 0) {
              cameraIds = conditions[p].join(',');
            }
            cluesObj = {
              ...cluesObj,
              cameraIds,
            };
          }
          if (p === 'startTime' || p === 'endTime') {
            cluesObj = {
              ...cluesObj,
              [p]: moment(conditions[p], 'YYYY/MM/DD HH:mm'),
            };
          }
        } else if (p === 'faceContent') {
          cluesObj = {
            ...cluesObj,
            faceContent: editContent(conditions[p]),
          };
        } else if (!inputObjectFilter.includes(p)) {
          inputObject = {
            ...inputObject,
            [p]: conditions[p],
          };
        }
      });

      let oldParams = {};
      Object.keys(conditions).forEach((key) => {
        if (['prevImages', 'current', 'keyValue', 'selectedMultipleSearch'].includes(key)) return;
        oldParams[key] = conditions[key];
      });
      oldParams.pageNum = 1;
      /**
       * 同行搜索的还原
       * 当有keyValue时刚当前存档为同行搜索
       */
      if (conditions.keyValue && Object.keys(conditions.keyValue).length > 0) {
        const { current, keyValue, selectedMultipleSearch } = conditions;
        const selectedItems = {};
        const newMultipleOldParams = {};
        Object.keys(selectedMultipleSearch).forEach((key) => {
          selectedItems[key] = orderBy(selectedMultipleSearch[key], 'wzbjsj', 'desc');
        });
        Object.keys(keyValue).forEach((key) => {
          newMultipleOldParams[key] = oldParams;
        });
        yield put({
          type: 'searchPanel/setState',
          payload: {
            currentKey: current,
            multRelation: keyValue,
            multSearchResult: selectedItems,
            multSelectedResult: selectedItems,
            multPrevParams: newMultipleOldParams,
          },
        });
      }

      if (conditions.prevImages) {
        oldParams = {
          ...oldParams,
          ...conditions.prevImages,
        };
      }

      const cardList = orderBy(details, 'wzbjsj', 'desc');
      yield put({
        type: 'searchPanel/setState',
        payload: {
          ...cluesObj,
          searchResult: cardList,
          selectedResult: cardList,
          prevParams: oldParams,
        },
      });
      yield put({ type: 'pathList/setState', payload: { current: 1 } });
      yield put({ type: 'structured/setState', payload: { formData: inputObject } });
      yield put({
        type: 'changeState',
        payload: { recordVisible: false, noNext: true },
      });
      yield put({
        type: 'searchingMap/setState',
        payload: {
          cameraIdList: conditions.cameraIds === '' ? [] : conditions.cameraIds,
        },
      });
    },
    *getTableData({ payload }, { call, put, select }) {
      const { exportIdAndState } = yield select(({ record }) => record);
      yield put({ type: 'changeState', payload: { tableLoading: true } });
      // yield put({ type: 'cluesForm/changeState', payload: { spinning: true } });
      const resp = yield call(getTableData, payload);
      yield put({ type: 'changeState', payload: { tableLoading: false } });
      // yield put({
      //   type: 'cluesForm/changeState',
      //   payload: { spinning: false },
      // });
      const { code, data, message: mess } = resp;
      if (code === 'SUCCESS') {
        const { list, total } = data;
        const dataSource = [];
        list.forEach((p) => {
          let value = jsonParse(p, 'conditions');
          value = jsonParse(value, 'details');
          dataSource.push(value);
        });
        // 切换页码时，循环清除导出的定时器
        Object.keys(exportIdAndState).forEach((item) => {
          if (exportIdAndState[item].timer) {
            clearInterval(exportIdAndState[item].timer);
          }
        });
        // 设置exportIdAndState的内容
        const object = {};
        dataSource.forEach((item) => {
          const a = {
            state: item.zipPackageStatus,
            timer: undefined,
          };
          object[item.id] = a;
        });
        yield put({
          type: 'changeState',
          payload: {
            tablePage: payload.pageNum,
            tablePageSize: payload.pageSize,
            tableTotal: total,
            dataSource,
            exportIdAndState: object,
          },
        });
      } else {
        notification.warn({
          message: '获取历史档案失败',
          description: mess,
          style: {
            zIndex: 3000,
          },
        });
      }
    },
    *deleteRecord({ payload, callback }, { call, put }) {
      yield put({ type: 'changeState', payload: { tableLoading: true } });
      const resp = yield call(deleteRecord, payload);
      const { code, message: mess } = resp;
      if (code === 'SUCCESS') {
        message.success('删除成功');
        callback();
      } else {
        notification.warn({
          message: '删除失败',
          description: mess,
          style: {
            zIndex: 3000,
          },
        });
      }
    },
    *getRecordById({ payload, callback }, { call, put }) {
      yield put({ type: 'changeState', payload: { tableLoading: true } });
      const resp = yield call(getRecordById, payload);
      yield put({ type: 'changeState', payload: { tableLoading: false } });
      const { code, data, message: mess } = resp;
      if (code === 'SUCCESS') {
        let value = jsonParse(data, 'conditions');
        value = jsonParse(value, 'details');
        if (Object.keys(value.conditions).length > 0) {
          callback(value);
        } else {
          notification.warn({
            message: '条件不足',
            description: '此条档案条件不足，无法还原！',
            style: {
              zIndex: 3000,
            },
          });
        }
      } else {
        notification.warn({
          message: '请求失败',
          description: mess,
          style: {
            zIndex: 3000,
          },
        });
      }
    },
    *getRecordConditions({ payload, callback }, { call }) {
      const resp = yield call(getRecordById, payload);
      const { code, data, message: mess } = resp;
      if (code === 'SUCCESS') {
        let value = jsonParse(data, 'conditions');
        value = jsonParse(value, 'details');
        if (Object.keys(value.conditions).length > 0) {
          callback(value);
        } else {
          notification.warn({
            message: '编辑失败',
            description: '此条档案条件不足，无法编辑！',
            style: {
              zIndex: 3000,
            },
          });
        }
      } else {
        notification.warn({
          message: '请求失败',
          description: mess,
          style: {
            zIndex: 3000,
          },
        });
      }
    },
    *merge({ payload, callback }, { call, put }) {
      yield put({ type: 'changeState', payload: { tableLoading: true } });
      const resp = yield call(merge, payload);
      yield put({ type: 'changeState', payload: { tableLoading: false } });
      const { code, message: mess } = resp;
      if (code === 'SUCCESS') {
        message.success('合并成功');
        callback(true);
      } else {
        callback(false);
        notification.warn({
          message: '合并失败',
          description: mess,
          style: {
            zIndex: 3000,
          },
        });
      }
    },
    *download({ payload }, { call, put }) {
      yield put({ type: 'changeState', payload: { tableLoading: true } });
      const resp = yield call(download, payload);
      yield put({ type: 'changeState', payload: { tableLoading: false } });
      saveAs(resp, '档案');
    },
    *putOssByBase64({ payload, isLoading, callback }, { call, put }) {
      if (isLoading) {
        yield put({
          type: 'changeState',
          payload: {
            addBase64Loading: true,
          },
        });
      }
      const res = yield call(putOssByBase64, payload);
      const { code, data } = res;
      if (code === 'SUCCESS') {
        callback(data);
      } else {
        message.error('base64解析失败，请重试');
      }
    },
    *editRecord({ payload, callback }, { call }) {
      const res = yield call(updateStudy, payload);
      const { code } = res;
      if (code === 'SUCCESS') {
        callback();
      } else {
        message.error('更新错误，请重试');
      }
    },
    *setTop({ payload, callback }, { call }) {
      const res = yield call(setTop, payload);
      const { code } = res;
      if (code === 'SUCCESS') {
        callback();
      } else {
        message.error('置顶/取消置顶失败！');
      }
    },
    /**
     * 开启身份研判，返回成功或失败
     */
    *getFaceJudegement({ payload, callback }, { call }) {
      const response = yield call(startFaceJudegement, payload);
      const { code, message: msg } = response;
      if (code === 'SUCCESS') {
        callback();
      } else {
        message.error(msg);
      }
    },
    /**
     * 获取人脸研判列表
     */
    *getFaceJudegementResult({ payload }, { put, call }) {
      const response = yield call(getFaceJudegementResult, payload);
      const { code, data = [], message: msg } = response;
      if (code === 'SUCCESS') {
        let personInfoList = [];
        if (data.length > 0) {
          /**
           * 当返回数据不为空时，把返回的数据遍历成前端需要的格式
           */
          personInfoList = data[0].faceJudegementInfoList.map((item) => ({
            avatar: `data:image/jpeg;base64,${item.photoBase64}`,
            name: item.name,
            idCard: item.idNumber || '暂无',
            address: item.address || '暂无',
          }));
        }
        yield put({
          type: 'changeState',
          payload: {
            personInfoList,
          },
        });
      } else {
        message.error(msg);
      }
    },
    /**
     * 列表项导出
     */
    *exportDownload({ payload, callback }, { call }) {
      const response = yield call(exportDownload, payload);
      const { code, data } = response;
      if (code === 'SUCCESS') {
        callback(Number(payload.id), data);
      }
    },
    /**
     * 打包状态
     */
    *zipPackAgeStatus({ payload, callback }, { call }) {
      try {
        const response = yield call(zipPackAgeStatus, payload);
        const { code, data, message: msg } = response;
        if (code === 'SUCCESS') {
          if (data === 2) {
            callback(payload.id);
          }
        } else {
          message.warn(msg);
        }
      } catch (e) {
        logger.log(e);
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
        ...initState,
      };
    },
  },
};
