import request from '@/utils/previous/request';
import URL from '@/utils/previous/request/url';

export async function getCaseNameList(params) {
  return request({
    url: URL.GET_JJD_AJ_UNION_LIST,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

export async function getActionNameData() {
  return request({
    url: URL.GET_ACTION_NAME_LIST,
    type: 'post',
    dataType: 'json',
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

export async function getGdId(params) {
  return request({
    url: URL.GET_GD_ID,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
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

export async function saveStudy(params) {
  return request({
    url: URL.SAVE_STUDY_PROCESS,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}

export async function getRecordList(params) {
  return request({
    url: URL.GET_GD_RECORD,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(params),
  });
}
