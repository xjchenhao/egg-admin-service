import { message } from 'antd';
import { info as queryUsers, info as queryCurrent, setProfile, resetPwd } from '../../services/sys/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);

      yield put({
        type: 'saveCurrentUser',
        payload: {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          id: response.result.id,
          name: response.result.name,
          email: response.result.email,
          mobile: response.result.mobile,
          account: response.result.account,
        },
      });
    },
    // *getProfile (_, { call, put, select }) {
    //   const id = yield select(state => state.user.currentUser.id);
    //   const response = yield call(getProfile, { id });

    //   yield put({
    //     type: 'getProfile',
    //     payload: {
    //       avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    //       id: response.result.id,
    //       name: response.result.name,
    //       email: response.result.email,
    //       mobile: response.result.mobile,
    //       account: response.result.account,
    //     },
    //   });
    // },
    *setProfile({ payload }, { call, select, put }) {
      const id = yield select(state => state.user.currentUser.id);
      yield call(setProfile, {
        ...payload,
        id,
      });
      // TODO: 手机号和邮箱没有做去重

      yield put({ type: 'fetchCurrent' });

      message.success('修改成功');
    },

    *resetPwd({ payload }, { call }) {
      const response = yield call(resetPwd, payload);

      if (!response) {
        return;
      }

      if (response.code === '0') {
        message.success('密码重置成功');
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
