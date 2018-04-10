import { routerRedux } from 'dva/router';
import { login, logout } from '../../services/sys/user';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // 登录失败
      if (response.code !== '0') {
        message.error(response.msg);
        return false;
      }

      // 登录成功
      if (response.code === '0') {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: response.result.userName,
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select, call }) {
      yield call(logout);
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
