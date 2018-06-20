import { login, logout } from '../../services/sys/user';
import router from 'umi/router';

export default {
  namespace: 'login',

  state: {
    type: '',
    status: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);

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

      router.push('/');
    },
    *logout(_, { put, select, call }) {
      yield call(logout);
      router.push('/sys/user/login');
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
