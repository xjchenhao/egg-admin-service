'use strict';

const { Service } = require('egg');
class BaseService extends Service {
  async proxy(url, opts) {
    const { ctx } = this;
    let proxyResult = '';

    proxyResult = await ctx.curl(url, {
      dataType: 'json',
      timeout: 5000,
      ...opts,
    });

    ctx.logger.info(`\n proxy => ${url}`, '\n', {
      req: {
        dataType: 'json',
        timeout: 5000,
        ...opts,
      },
      res: proxyResult,
    });

    if (proxyResult.status < 200 || proxyResult.status > 299) {
      throw (proxyResult.data);
    }
    return proxyResult.data.data;
  }
}
module.exports = BaseService;
