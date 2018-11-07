import { login, logout } from '../../services/sys/user';

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
            currentAuthority: 'guest',
          },
        });

        return false;
      }

      yield put({
        type: 'changeLoginStatus',
        payload: {
          type: 'account',
          currentAuthority: response.result.groupList.length ? response.result.groupList : 'guest',
        },
      });

      window.location.href = redirect ? redirect : '/';
    },
    *logout (_, { put, select, call }) {
      yield call(logout);
      window.location.href = `/?redirect=${encodeURIComponent(window.g_history.location.pathname)}#/sys/user/login`;
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
