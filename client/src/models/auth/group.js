import { message } from 'antd';
import { getList, getGroupsInfo, editGroupInfo, addGroup, removeGroup } from '../../services/auth/group';

export default {
  namespace: 'group',

  state: {
    data: {
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
    *details({ payload, callback }, { call, put }) {
      const response = yield call(getGroupsInfo, payload);

      yield put({
        type: 'changeDetails',
        payload: response.result,
      });

      if (callback) callback();
    },

    *edit({ payload, callback }, { call }) {
      const response = yield call(editGroupInfo, {
        ...payload,
      });
      if (response.code === '0') {
        message.success('编辑成功');
      } else {
        message.error(response.msg);
      }

      if (callback) callback();
    },

    *add({ payload, callback }, { call }) {
      const response = yield call(addGroup, payload);
      if (response.code === '0') {
        message.success('添加成功');
      } else {
        message.error(response.msg);
      }

      if (callback) callback();
    },

    *reset({ callback }, { put }) {
      yield put({
        type: 'changeDetails',
        payload: {},
      });

      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      let response = '';
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      if (Array.isArray(payload.id)) {
        response = yield call(removeGroup, {
          idList: payload.id,
        });
      } else {
        response = yield call(removeGroup, payload);
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
