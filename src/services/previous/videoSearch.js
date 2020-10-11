import moment from 'moment';
import { notification, message } from 'antd';

import request, { responseCode } from '@/utils/previous/request';
import URL from '@/utils/previous/request/url';

const { SUCCESS } = responseCode;

// 获取派出所列表
export async function getPoliceStationList(params) {
  return request({
    url: URL.GET_POLICE_STATIONS,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

// 获取摄像头类型
export async function getCameraTypeList(params) {
  return request({
    url: URL.GET_CAMERA_TYPE_LIST,
    type: 'get',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

// 获取摄像头
export async function getCameraList(params) {
  return request({
    url: URL.SELECT_CAMERA_LIST_BY_SCHEDUL_LOG_TIME,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

export async function getRealtimeRecord() {
  return request({
    url: URL.GET_REALTIME_RECORD,
    type: 'GET',
    contentType: 'application/json',
  });
}

export async function saveRealtimeRecord(params) {
  return request({
    url: URL.SAVE_REALTIME_RECORD,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

export const getFaceToPersoninfo = (params) =>
  request({
    url: URL.GET_FACE_TO_PERSONINFO,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });

export const getFaceList = (params) =>
  request({
    url: URL.GET_STRUCTURED,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });

export const getAllFaceList = (params) =>
  request({
    url: URL.GET_ALL_FACE,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });

export const getAllBodyList = (params) =>
  request({
    url: `${URL.GET_ALL_FACE}?type=body`,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });

export const getSamePersonList = (params) =>
  request({
    url: URL.GET_PERSON_GROUP_LIST,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
export const upDp = (params) =>
  request({
    url: URL.UP_DP,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });

export const downDp = () =>
  request({
    url: URL.DOWN_DP,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
  });

export const getSearchImageErrorInfo = () =>
  request({
    url: URL.GET_SEARCH_IMAGE_ERROR_INFO,
    type: 'get',
    contentType: 'application/json',
  });

export const search = (params) => {
  const startTime = moment(new Date()).format('x');
  let endTime = null;
  return new Promise((resolve, reject) => {
    request({
      url: URL.SELECT_VIDEO_LIST,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(params),
    })
      .then((res) => {
        const { code, data, message: info } = res;
        if (code === SUCCESS) {
          if (data.list.length === 0) {
            notification.warn({
              message: '未检索出数据',
              description: '本次检索，未检索出数据',
            });
          }
          endTime = moment(new Date()).format('x');
          const time = (endTime - startTime) / 1000;
          if (typeof data.flag === 'string' && data.flag.includes('同行搜索')) {
            message.success(
              `本次检索耗时${time}s,返回图片${data.list
                .map((item) => item.list.length)
                .reduce((acc, cur) => acc + cur)}张`,
            );
          } else {
            message.success(`本次检索耗时${time}s,返回图片${data.list.length}张`);
          }

          resolve(data);
        } else {
          let text = info;
          if (text.indexOf('7天内') !== -1) {
            text = '特征搜索的开始时间和结束时间需在当前日期7天内！！！';
          }
          notification.error({
            message: '提示',
            description: text,
          });
          reject();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
