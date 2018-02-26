import { getList } from '../../services/auth/users';

export default {
  namespace: 'users',

  state: {
    data: {
      list: [],
      pagination: {},
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
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // *add({ payload, callback }, { call, put }) {
    //   yield put({
    //     type: 'changeLoading',
    //     payload: true,
    //   });
    //   const response = yield call(addRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   yield put({
    //     type: 'changeLoading',
    //     payload: false,
    //   });

    //   if (callback) callback();
    // },
    // *remove({ payload, callback }, { call, put }) {
    //   yield put({
    //     type: 'changeLoading',
    //     payload: true,
    //   });
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   yield put({
    //     type: 'changeLoading',
    //     payload: false,
    //   });

    //   if (callback) callback();
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
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
