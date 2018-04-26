import mockjs from 'mockjs';

export default {
  info: mockjs.mock({
    code: '0',
    msg: 'ok',
    result: {
      'id|1-100': 84,
      userName: '@cname',
    },
  }),
};
