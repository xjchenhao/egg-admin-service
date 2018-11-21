import { login, logout } from '../../services/sys/user';
import router from 'umi/router';

export default {
  namespace: 'login',

  state: {
    type: '',
    status: '',
  },

  effects: {
    *login ({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { redirect } = window.g_history.location.query;

      if (response.code !== '0') {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            type: 'account',
            status: '1',
            currentAuthority: 'guest',
          },
        });

        return false;
      }

      yield put({
        type: 'changeLoginStatus',
        payload: {
          type: 'account',
          status: '0',
          currentAuthority: response.result.groupList.length ? response.result.groupList : 'guest',
        },
      });

      router.push(redirect ? redirect : '/');
    },
    *logout (_, { put, select, call }) {
      yield call(logout);
      router.push(`/sys/user/login?redirect=${encodeURIComponent(window.g_history.location.pathname)}`);
    },
  },

  reducers: {
    changeLoginStatus (state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
