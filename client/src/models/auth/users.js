import { message } from 'antd';
import { getList, resetPwd, getUserInfo, addUserInfo, editUserInfo, removeUser, removeUsers } from '../../services/auth/users';

export default {
  namespace: 'users',

  state: {
    data: {
      filterQuery: {},
      list: [],
      pagination: {},
    },
    details: {

    },
    loading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getList, payload);
      yield put({
        type: 'save',
        payload: {
          filterQuery: payload,
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
    *resetPwd({ payload }, { call }) {
      const response = yield call(resetPwd, payload);
      if (response.code === '0') {
        message.success('密码重置成功');
      } else {
        message.error(response.msg);
      }
    },
    *details({ payload, callback }, { call, put }) {
      const response = yield call(getUserInfo, payload);

      yield put({
        type: 'changeDetails',
        payload: response.result,
      });

      if (callback) callback();
    },

    *edit({ payload, callback }, { call, put, select }) {
      const response = yield call(editUserInfo, {
        ...payload,
      });
      if (response.code === '0') {
        message.success('编辑成功');
      } else {
        message.error(response.msg);
      }

      // 刷新
      const filterQuery = yield select(state => state.users.data.filterQuery);
      yield put({ type: 'fetch', payload: filterQuery });

      if (callback) callback();
    },

    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(addUserInfo, payload);
      if (response.code === '0') {
        message.success('添加成功');
      } else {
        message.error(response.msg);
      }

      // 刷新
      const filterQuery = yield select(state => state.users.data.filterQuery);
      yield put({ type: 'fetch', payload: filterQuery });

      if (callback) callback();
    },

    *reset({ callback }, { put }) {
      yield put({
        type: 'changeDetails',
        payload: {},
      });

      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put, select }) {
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

      // 刷新
      const filterQuery = yield select(state => state.users.data.filterQuery);
      yield put({ type: 'fetch', payload: filterQuery });

      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeDetails(state, action) {
      return {
        ...state,
        details: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
