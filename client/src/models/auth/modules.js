import { message } from 'antd';
import { getList, getDetails, editDetails, add, remove, getSystemTree } from '../../services/auth/modules';

export default {
  namespace: 'modules',

  state: {
    data: {
      query: {},
      list: [],
      pagination: {},
    },
    breadcrumb: [{
      id: '',
      name: 'Root',
    }],
    systemTree: {
      checkedId: 0,
      data: [],
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

      if (!response) {
        return;
      }

      yield put({
        type: 'save',
        payload: {
          data: {
            query: payload,
            list: response.result.list.map(obj => Object.assign(obj, { key: obj.id })),
            pagination: {
              current: response.result.currentPage,
              pageSize: response.result.pages,
              total: response.result.total,
            },
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *details({ payload, callback }, { call, put }) {
      const response = yield call(getDetails, payload);

      if (!response) {
        return;
      }

      yield put({
        type: 'changeDetails',
        payload: response.result,
      });

      if (callback) callback();
    },

    *edit({ payload, callback }, { call, select, put }) {
      const response = yield call(editDetails, {
        ...payload,
      });

      if (!response) {
        return;
      }

      if (response.code === '0') {
        message.success('编辑成功');
      } else {
        message.error(response.msg);
      }

      // 刷新
      const query = yield select(state => state.modules.data.query);
      yield put({ type: 'fetch', payload: query });

      if (callback) callback();
    },

    *add({ payload, callback }, { call, select, put }) {
      const response = yield call(add, payload);

      if (!response) {
        return;
      }

      if (response.code === '0') {
        message.success('添加成功');
      } else {
        message.error(response.msg);
      }

      // 刷新
      const query = yield select(state => state.modules.data.query);
      yield put({ type: 'fetch', payload: query });
      yield put({ type: 'getSystemTree', payload: {} });

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
        response = yield call(remove, {
          idList: payload.id,
        });
      } else {
        response = yield call(remove, payload);
      }

      if (!response) {
        return;
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
      const query = yield select(state => state.modules.data.query);
      yield put({ type: 'fetch', payload: query });

      if (callback) callback();
    },

    *intoModule({ payload: { id, name }, callback }, { put, select }) {
      const query = yield select(state => state.modules.data.query);
      yield put({
        type: 'fetch',
        payload: {
          ...query,
          parent_id: id,
        },
      });

      yield put({
        type: 'pushBreadcrumb',
        payload: {
          id,
          name,
        },
      });

      if (callback) callback();
    },

    *outModule({ payload: { id }, callback }, { put, select }) {
      const query = yield select(state => state.modules.data.query);
      yield put({
        type: 'fetch',
        payload: {
          ...query,
          parent_id: id,
        },
      });

      yield put({
        type: 'popBreadcrumb',
        payload: {
          id,
        },
      });

      if (callback) callback();
    },
    *getSystemTree({ payload, callback }, { put, call }) {
      const response = yield call(getSystemTree, payload);

      yield put({
        type: 'save',
        payload: {
          systemTree: {
            checkedId: 0,
            data: response.result,
          },
        },
      });

      if (callback) callback();
    },
    *setSystemTreeCheckedId({ payload: { id }, callback }, { put }) {
      yield put({
        type: 'changeSystemTreeCheckedId',
        payload: {
          id,
        },
      });

      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
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
    pushBreadcrumb(state, action) {
      const { breadcrumb } = state;
      console.log(breadcrumb);

      breadcrumb.push(action.payload);

      return {
        ...state,
        breadcrumb,
      };
    },
    popBreadcrumb(state, action) {
      const { breadcrumb } = state;
      const { id } = action.payload;
      let index = 0; // 该下标后面的面包屑数组将会被pop掉

      breadcrumb.forEach((item, i) => {
        if (item.id === id) {
          index = i;
        }
      });

      return {
        ...state,
        breadcrumb: breadcrumb.slice(0, index + 1),
      };
    },
    changeSystemTreeCheckedId(state, action) {
      return {
        ...state,
        systemTree: {
          checkedId: action.payload.id,
          data: state.systemTree.data,
        },
      };
    },
  },
};
