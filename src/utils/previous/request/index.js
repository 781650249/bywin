
import request from 'superagent';
import router from 'umi/router';
import logger from '@/utils/logger';
import { SSO } from '@/config';
import { isJSONString } from '@/utils/previous/tools';
import { session } from '@/utils/storage'

const { isSSO, loginUrl } = SSO;
export const responseCode = {
  FAIL: 'FAIL',
  SUCCESS: 'SUCCESS',
  LOGOUT: 'LOGOUT',
};

function req(option) {
  return new Promise((resolve) => {
    const method = option.type.toLowerCase();
    let reqObj = request[method](option.url).withCredentials();
    if (option.contentType) {
      reqObj = reqObj.set('Content-Type', option.contentType);
    }

    reqObj = reqObj.set('Authorization', session.get('token') || '');
    if (option.data) {
      if (typeof option.data === 'string') {
        if (/json/.test(option.contentType)) {
          reqObj.send(JSON.parse(option.data));
        } else {
          reqObj.send(option.data);
        }
      } else {
        reqObj.query(option.data);
      }
    }
    reqObj.timeout({
      deadline: option.timeout || 1000 * 60 * 2,
    });
    reqObj
      .then((resp) => {
        let res = resp.text;
        if (/json/.test(option.contentType) || isJSONString(res)) {
          res = JSON.parse(res);
          if (
            res.code === 'LOGOUT' ||
            res.message === '未登录' ||
            res.message === '当前没有登录,请跳转到登录页'
          ) {
            session.remove('token');
            if (isSSO) {
              window.location.href = `${loginUrl}${window.location.pathname}`;
            } else {
              router.push('/login');
            }
            return;
          }
          if (res.code === responseCode.FAIL && /^您的License证书无效/.test(res.message)) {
            router.push(`/sys-config/license?machineCode=${res.data}`);
          } else {
            logger.log(res);
            resolve(res);
          }
        }
        logger.log(res);
        return resolve(res);
      })
      .catch((error) => {
        logger.log(error);
        const res = { code: 'FAIL', message: '请求出错，请稍后再试！' };
        if (String(error).includes('Timeout')) {
          res.message = '请求超时，请稍后再试!';
        }
        resolve(res);
      });
  });
}

export default req;
