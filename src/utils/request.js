import axios from 'axios';
import router from 'umi/router';
import { message } from 'antd';
import { SSO } from '@/config';
import { session } from '@/utils/storage';
import logger from './logger';

const { isSSO, loginUrl } = SSO;
class Request {
  constructor() {
    this.config = {
      baseURL: '/api',
      timeout: 1000 * 60,
      responseType: 'json',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    };
  }

  get(url = '', params = {}, options = {}) {
    return this.fetch({
      ...options,
      method: 'get',
      url,
      params,
    });
  }

  post(url = '', data = {}, options = {}) {
    return this.fetch({
      ...options,
      method: 'post',
      url,
      data,
    });
  }

  delete(url = '', params = {}, options = {}) {
    return this.fetch({
      ...options,
      method: 'delete',
      url,
      params,
    });
  }

  errorCode(res) {
    if (res instanceof Object) {
      return Promise.reject(res);
    }
    return Promise.reject();
  }

  fetch(options = {}) {
    const nextOptions = {
      ...this.config,
      ...options,
    };
    if (!isSSO) {
      nextOptions.headers.Authorization = session.get('token') || '';
    }
    return axios({ ...nextOptions })
      .then((response) => {
        logger.log(response);
        const { status, data } = response;
        if (status === 200 && options.url === 'check/login' && !data) {
          return null;
        }
        if (status === 200 && data) {
          let res = {};
          if (typeof data === 'string') {
            try {
              res = JSON.parse(data);
            } catch (error) {
              logger.log(error);
              res = {};
            }
          } else {
            res = { ...data };
          }
          if (res.code === 'SUCCESS') {
            return data;
          }

          if (res.code === 'LOGOUT' || res.message === '未登录' || res.statusInfo === '未登录') {
            if (isSSO) {
              session.set('loginStatus', false);
              session.set('user', {});
              window.location.href = `${loginUrl}${window.location.pathname}`;
            } else {
              session.remove('token');
              router.push('/login');
            }
            return;
          }
          return this.errorCode(res);
        }
        return Promise.reject(data);
      })
      .catch((error) => {
        logger.log(error);
        let errorCode = {};
        if (error && error.name === 'Error') {
          errorCode = {
            code: 'FAIL',
            statusInfo: error,
          };
        } else if (error instanceof Object) {
          const { message: errorMsg } = error;

          if (errorMsg.length > 0 && errorMsg.length < 20) {
            message.error(errorMsg);
          } else {
            // eslint-disable-next-line no-console
            console.error(errorMsg);
          }
          errorCode = {
            ...error,
            message: errorMsg,
          };
        } else {
          errorCode = {
            statusCode: 'FAIL',
            statusInfo: '',
          };
        }
        return Promise.reject(errorCode);
      });
  }
}

const request = new Request();

export default request;
