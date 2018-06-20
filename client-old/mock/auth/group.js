import mockjs from 'mockjs';
import { parse } from 'url';

export default {
  list(req, res, u) {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }
    const params = parse(url, true).query;
    const pageSize = params.pageSize * 1 || 10;
    const result = mockjs.mock({
      code: '0',
      msg: 'OK',
      result: {
        [`list|${pageSize}`]: [
          {
            'id|1-1000': 95,
            name: '@ctitle',
            summary: '@csentence',
            addtime: '--',
            addip: '@email',
          },
        ],
        currentPage: parseInt(params.currentPage, 10) || 1,
        pages: pageSize,
        total: 100,
      },
    });

    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  },
  details: mockjs.mock({
    code: '0',
    msg: 'ok',
    result: {
      name: '@ctitle',
      summary: '@csentence',
    },
  }),
  modules: mockjs.mock({
    code: '0',
    msg: 'ok',
    result: {
      name: '@ctitle',
      summary: '@csentence',
    },
  }),
  users: mockjs.mock({
    code: '0',
    msg: 'ok',
    result: {
      name: '@ctitle',
      summary: '@csentence',
    },
  }),
};
