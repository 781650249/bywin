import moment from 'moment';
import md5 from 'md5';
import { cloneDeep, uniqBy } from 'lodash';
import { search } from '@/services/previous/videoSearch';

const initState = {
  loading: false,
  searchType: 'person', // 搜索类型
  startTime: moment().subtract('days', 1), // 开始时间
  endTime: moment(), // 结束时间
  plateNumber: '', // 车牌号
  content: [], // 普通图片
  faceContent: [], // 人脸图片

  prevParams: {}, // 上次搜索的参数
  multPrevParams: {}, // 同行搜索存储每个对应的搜索参数
  page: 1, // 当前页
  pageSize: 100,
  pages: {}, // 存储同行对应的当前页

  searchResult: [], // 搜索结果
  selectedResult: [], // 选中的搜索结果

  currentKey: '', // 同行当前项的key
  multRelation: {}, // 同行条件和结果的关联
  multSearchResult: {}, // 同行搜索结果
  multSelectedResult: {}, // 选中的同行搜索结果

  currentPoint: {}, // 最后一次选中的结果

  cropperVisible: false, // 截图窗口是否可见

  keyPersonParams: { type: 0, id: '' }, // 点位更新要用到，type: 0|1 本人或关系人
};

export default {
  namespace: 'searchPanel',
  state: {
    ...initState,
  },
  effects: {
    *search({ payload = {}, callback = () => {} }, { call, put }) {
      yield put({ type: 'searching/setLoading', loading: true });
      try {
        const res = yield call(search, payload);
        yield put({ type: 'searching/setLoading', loading: false });
        const { list, flag, retrieval_query_id: retrievalQueryId } = res;
        const { isNewImage, ...params } = payload;
        if (isNewImage) {
          yield put({
            type: 'handleIncrementSearch',
            payload: {
              flag,
              list,
              params,
              retrievalQueryId,
            },
          });
          callback();
          return;
        }

        if (retrievalQueryId) {
          yield put({
            type: 'setState',
            payload: {
              retrievalQueryId,
            },
          });
        }

        if (typeof flag === 'string' && flag.includes('同行搜索')) {
          yield put({
            type: 'handleMultSearch',
            payload: {
              list,
              params: payload,
            },
          });
        } else {
          yield put({
            type: 'handleSearch',
            payload: {
              list,
              params: payload,
            },
          });
        }
      } catch (error) {
        yield put({ type: 'searching/setLoading', loading: false });
      }
    },
    *nextPage({ payload = {} }, { call, put }) {
      yield put({ type: 'searching/setLoading', loading: true });
      const res = yield call(search, payload);
      yield put({ type: 'searching/setLoading', loading: false });
      const { list } = res;
      yield put({
        type: 'handleNextPage',
        payload: {
          list,
          params: payload,
        },
      });
    },
  },
  reducers: {
    // 搜索结果数据整理
    handleSearch(state, { payload }) {
      const { selectedResult: prevSelectedResult } = state;
      const { list, params } = payload;
      let searchResult = [...list];
      if (prevSelectedResult.length > 0) {
        searchResult = uniqBy([...prevSelectedResult, ...list], 'id');
      }
      const prevParams = { ...params };
      return {
        ...state,
        prevParams,
        searchResult,
      };
    },
    // 同行搜索结果数据整理
    handleMultSearch(state, { payload }) {
      // const { } = state;
      const { list, params } = payload;
      let prevParams = {};
      let searchResult = [];
      let currentKey = '';
      const multRelation = {};
      const multPrevParams = {};
      const multSearchResult = {};
      const multSelectedResult = {};
      const retrievalQueryId = {};
      list.forEach((item, i) => {
        const key = md5(item.base64);
        multRelation[key] = item.base64;
        multSearchResult[key] = item.list;
        multSelectedResult[key] = [];
        multPrevParams[key] = {
          ...params,
          content: null,
          faceContent: null,
        };
        if (params.content && params.content.includes(item.base64)) {
          multPrevParams[key].content = item.base64;
        }
        if (params.faceContent && params.faceContent.includes(item.base64)) {
          multPrevParams[key].faceContent = item.base64;
        }
        if (i === 0) {
          currentKey = key;
          prevParams = {
            ...multPrevParams[key],
          };
          searchResult = [...item.list];
        }
        if (item.retrieval_query_id) {
          retrievalQueryId[key] = item.retrieval_query_id;
        }
      });
      return {
        ...state,
        prevParams,
        searchResult,
        currentKey,
        multRelation,
        multPrevParams,
        multSearchResult,
        multSelectedResult,
        retrievalQueryId,
      };
    },
    // 增量搜索 （新增人体或人脸）
    handleIncrementSearch(state, { payload }) {
      const {
        content,
        prevParams,
        searchResult,
        selectedResult,
        currentKey: prevCurrentKey,
        multPrevParams: prevMultPrevParams,
        multRelation: prevMultRelation,
        multSearchResult: prevMultSearchResult,
        multSelectedResult: prevMultSelectedResult,
        retrievalQueryId: prevRetrievalQueryId,
      } = state;
      const { flag, list, params, retrievalQueryId: currentRetrievalQueryId } = payload;
      let currentKey = prevCurrentKey;
      const multRelation = { ...prevMultRelation };
      const multSearchResult = { ...prevMultSearchResult };
      const multSelectedResult = { ...prevMultSelectedResult };
      const multPrevParams = { ...prevMultPrevParams };
      const retrievalQueryId = {};

      if (!currentKey) {
        const value = prevParams.content || prevParams.faceContent || content[0];
        const key = md5(value);
        currentKey = key;
        multRelation[key] = value;
        multSearchResult[key] = [...searchResult];
        multSelectedResult[key] = [...selectedResult];
        multPrevParams[key] = { ...prevParams };
        if (Object.keys(prevRetrievalQueryId).length > 0) {
          retrievalQueryId[key] = { ...prevRetrievalQueryId };
        }
      }

      if (typeof flag === 'string' && flag.includes('同行搜索')) {
        list.forEach((item) => {
          const key = md5(item.base64);
          multRelation[key] = item.base64;
          multSearchResult[key] = item.list;
          multSelectedResult[key] = [];
          multPrevParams[key] = {
            ...params,
            content: null,
            faceContent: null,
          };
          if (params.content && params.content.includes(item.base64)) {
            multPrevParams[key].content = item.base64;
          }
          if (params.faceContent && params.faceContent.includes(item.base64)) {
            multPrevParams[key].faceContent = item.base64;
          }
          if (item.retrieval_query_id) {
            retrievalQueryId[key] = item.retrieval_query_id;
          }
        });
      } else {
        const value = params.content || params.faceContent;
        const key = md5(value);
        multRelation[key] = value;
        multSearchResult[key] = list;
        multSelectedResult[key] = [];
        multPrevParams[key] = { ...params };
        if (currentRetrievalQueryId) {
          retrievalQueryId[key] = currentRetrievalQueryId;
        }
      }
      return {
        ...state,
        currentKey,
        multRelation,
        multSearchResult,
        multSelectedResult,
        multPrevParams,
        retrievalQueryId,
      };
    },
    // 同行搜索多个结果切换
    multSearchChange(state, { currentKey }) {
      const { currentKey: prevCurrentKey } = state;
      const multPrevParams = { ...state.multPrevParams };
      const multSearchResult = { ...state.multSearchResult };
      const multSelectedResult = { ...state.multSelectedResult };

      // 把当前项的数据同步到同行里
      multPrevParams[prevCurrentKey] = cloneDeep(state.prevParams);
      multSearchResult[prevCurrentKey] = cloneDeep(state.searchResult);
      multSelectedResult[prevCurrentKey] = cloneDeep(state.selectedResult);

      // 从同行数据里取出数据
      const prevParams = cloneDeep(multPrevParams[currentKey]);
      const searchResult = cloneDeep(multSearchResult[currentKey]);
      const selectedResult = cloneDeep(multSelectedResult[currentKey]);
      return {
        ...state,
        currentKey,
        prevParams,
        multPrevParams,
        searchResult,
        multSearchResult,
        selectedResult,
        multSelectedResult,
      };
    },
    // 删除某个同行项
    multSearchDelete(state, { currentKey }) {
      const { currentKey: prevCurrentKey } = state;
      let multRelation = { ...state.multRelation };
      let multPrevParams = { ...state.multPrevParams };
      let multSearchResult = { ...state.multSearchResult };
      let multSelectedResult = { ...state.multSelectedResult };

      let prevParams = { ...state.prevParams };
      let searchResult = [...state.searchResult];
      let selectedResult = [...state.selectedResult];
      let nextCurrentKey = prevCurrentKey;

      const keys = Object.keys(multRelation);

      if (currentKey === prevCurrentKey) {
        nextCurrentKey = keys.find((k) => k !== currentKey);
        prevParams = cloneDeep(multPrevParams[nextCurrentKey]);
        searchResult = cloneDeep(multSearchResult[nextCurrentKey]);
        selectedResult = cloneDeep(multSelectedResult[nextCurrentKey]);
      }
      if (keys.length === 2) {
        nextCurrentKey = '';
        multRelation = {};
        multPrevParams = {};
        multSearchResult = {};
        multSelectedResult = {};
      } else {
        delete multRelation[currentKey];
        delete multPrevParams[currentKey];
        delete multSearchResult[currentKey];
        delete multSelectedResult[currentKey];
      }
      return {
        ...state,
        currentKey: nextCurrentKey,
        prevParams,
        searchResult,
        selectedResult,
        multRelation,
        multPrevParams,
        multSearchResult,
        multSelectedResult,
      };
    },
    // 加载下一页的数据拼接
    handleNextPage(state, { payload }) {
      const { searchResult: prevSearchResult } = state;
      const { list, params } = payload;
      const searchResult = [...prevSearchResult, ...list];
      const prevParams = { ...params };
      return {
        ...state,
        prevParams,
        searchResult,
      };
    },
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
