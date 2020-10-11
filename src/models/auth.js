import router from 'umi/router';
import logger from '@/utils/logger';
import { session } from '@/utils/storage';
import { getToken, checkLogin, logout } from '@/services/auth';
import { SSO } from '@/config';

const initState = {
  loginStatus: session.get('loginStatus') || false,
  username: session.get('user') ? session.get('user').username : '',
  account: session.get('user') ? session.get('user').account : '',
};

export default {
  namespace: 'auth',
  state: {
    ...initState,
  },
  effects: {
    *getToken({ payload }, { call, put }) {
      const res = yield call(getToken, payload);
      const { data = '' } = res;
      if (data) {
        const userinfo = { username: payload.username, account: payload.username };
        session.set('loginStatus', true);
        session.set('user', userinfo);
        session.set('token', data);
        yield put({
          type: 'setState',
          payload: {
            loginStatus: true,
            ...userinfo,
          },
        });
        router.push({ pathname: '/situation', state: 'login' });
      }
    },
    *checkLogin({ payload }, { call, put }) {
      try {
        const res = yield call(checkLogin, payload);
        const { pathname, search } = window.location;
        if (res === null) {
          router.push(pathname);
          return;
        }
        const { data = {} } = res;
        const userinfo = { username: data.user.name, account: data.user.username };
        session.set('loginStatus', true);
        session.set('user', userinfo);
        router.push(`${pathname}${search}`);
        yield put({
          type: 'setState',
          payload: {
            loginStatus: true,
            ...userinfo,
          },
        });
      } catch (error) {
        logger.error(error);
      }
    },
    *logout(_, { call, put }) {
      const res = yield call(logout);
      const { data } = res;
      session.remove('token');
      session.set('loginStatus', false);
      yield put({
        type: 'setState',
        payload: {
          loginStatus: false,
        },
      });
      if (SSO.isSSO) {
        window.location.href = data;
      } else {
        setTimeout(() => {
          router.push('/login');
        }, 200);
      }
    },
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
