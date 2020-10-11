import { stringify } from 'qs';
import request from '@/utils/previous/request';
import URL from '@/utils/previous/request/url';

export async function startFaceJudegement(params) {
  return request({
    url: `${URL.START_FACE_JUDEGEMENT}?${stringify(params)}`,
    type: 'GET',
    contentType: 'application/json',
  });
}
export async function getFaceJudegementResult(params) {
  return request({
    url: `${URL.GET_FACE_JUDEGEMENT_RESULT}?id=${params.id}`,
    type: 'GET',
    contentType: 'application/json',
  });
}

export async function setTop(params = {}) {
  const { id = '', operate = 1 } = params;
  return request({
    url: `${URL.SET_RECORD_TOP_NUMBER}?id=${id}&operate=${operate}`,
    type: 'GET',
    contentType: 'application/json',
  });
}

export async function getRecordById(params) {
  return request({
    url: URL.GET_GD_RECORD_BY_ID,
    type: 'get',
    // dataType: 'json',
    contentType: 'application/json',
    data: params,
  });
}

export async function deleteRecord(params) {
  return request({
    url: URL.DELETE_GD_RECORD,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

export async function getTableData(params) {
  return request({
    url: URL.GET_GD_RECORD,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

export async function merge(params) {
  return request({
    url: URL.MERGE_ARCHIVE_BY_JQID,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

// 将base64图片上传到数字警务室oss
export async function putOssByBase64(params) {
  return request({
    url: URL.PUT_OSS_BY_BASE64,
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({ ...params }),
  });
}

export async function updateStudy(params) {
  return request({
    url: URL.UPDATE_ARCHIVE,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}


export async function download(params) {
  return request({
    url: `${URL.DOWNLOAD_GD_INFO}?id=${params.id}`,
    type: 'get',
    // dataType: 'json',
    contentType: 'application/json',
    // data: JSON.stringify(params),
  });
}

export async function exportDownload(params) {
  return request({
    url: `${URL.DOWNLOAD_GD_INFO}?id=${params.id}&exportContent=${''}`,
    type: 'get',
    // dataType: 'json',
    contentType: 'application/json',
    // data: JSON.stringify(params),
  });
}

// 导出打包的状态
export async function zipPackAgeStatus(params = {}) {
  return request({
    url: `${URL.ZIP_PACK_AGESTATUS}/${params.id}`,
    type: 'GET',
    contentType: 'application/json',
  });
}