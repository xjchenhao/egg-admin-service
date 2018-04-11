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
            mobile: '',
            account: '@last',
            name: '@cname',
            email: '@email',
            remark: '@cword',
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
      'id|1-1000': 95,
      account: '@last',
      name: '@cname',
      'sex|18-60': 1,
      mobile: '',
      email: '@email',
      remark: '@cword',
    },
  }),
};
