import mockjs from 'mockjs';

export default {
  resultSuccess: mockjs.mock({
    code: '0',
    msg: 'ok',
    result: {},
  }),

  resultFailure: mockjs.mock({
    code: '1',
    msg: '操作失败',
    result: {},
  }),
  resultRandom: mockjs.mock({
    'code|1': ['0', '1'],
    msg: '操作失败',
    result: {},
  }),
};
