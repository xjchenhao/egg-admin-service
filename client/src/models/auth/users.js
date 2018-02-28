import { message } from 'antd';
import { getList, resetPwd, getUserInfo, addUserInfo, editUserInfo, removeUser, removeUsers } from '../../services/auth/users';

export default {
  namespace: 'users',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    userInfo: {

    },
    loading: true,
  },

  effects: {
    *fetch ({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.result.list.map(obj => Object.assign(obj, { key: obj.id })),
          pagination: {
            currentPage: response.result.currentPage,
            pageSize: response.result.pages,
            total: response.result.total,
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *resetPwd ({ payload }, { call }) {
      const response = yield call(resetPwd, payload);
      if (response.code === '0') {
        message.success('密码重置成功');
      } else {
        message.error(response.msg);
      }
    },
    *getUserInfo ({ payload, callback }, { call, put }) {
      const response = yield call(getUserInfo, payload);

      yield put({
        type: 'changeUserInfo',
        payload: response.result,
      });

      if (callback) callback();
    },

    *editUserInfo ({ payload, callback }, { call }) {
      const response = yield call(editUserInfo, {
        ...payload,
      });
      if (response.code === '0') {
        message.success('编辑成功');
      } else {
        message.error(response.msg);
      }

      if (callback) callback();
    },

    *addUserInfo ({ payload, callback }, { call }) {
      const response = yield call(addUserInfo, payload);
      if (response.code === '0') {
        message.success('添加成功');
      } else {
        message.error(response.msg);
      }

      if (callback) callback();
    },

    *resetUserInfo ({ callback }, { put }) {
      yield put({
        type: 'changeUserInfo',
        payload: {},
      });

      if (callback) callback();
    },

    *remove ({ payload, callback }, { call, put }) {
      let response = '';
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      if (Array.isArray(payload.id)) {
        response = yield call(removeUsers, {
          idList: payload.id,
        });
      } else {
        response = yield call(removeUser, payload);
      }

      if (response.code === '0') {
        message.success('删除成功');
      } else {
        message.error(response.msg);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeUserInfo (state, action) {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
    changeLoading (state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
