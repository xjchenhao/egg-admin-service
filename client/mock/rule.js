import mockjs from 'mockjs';

export default {
  resultSuccess(req, res) {
    const result = mockjs.mock({
      code: '0',
      msg: 'ok',
      result: {},
    });

    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  },

  resultFailure(req, res) {
    const result = mockjs.mock({
      code: '1',
      msg: '操作失败',
      result: {},
    });

    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  },
  resultRandom(req, res) {
    const result = mockjs.mock({
      'code|1': ['0', '1'],
      msg: '操作失败',
      result: {},
    });

    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  },
};
