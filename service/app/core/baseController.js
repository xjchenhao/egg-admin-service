'use strict';

const { Controller } = require('egg');
class BaseController extends Controller {
  success(data, state) {
    const { ctx } = this;
    ctx.body = {
      code: '0',
      msg: 'OK',
      result: data,
    };
    ctx.status = state || 200;
  }
  failure({ state, data, code, msg }) {
    const { ctx } = this;
    const defaultCode = (state >= 200 && state < 300) ? 0 : state;

    ctx.body = {
      code: String(code || defaultCode),
      msg: msg || ctx.helper.errorCode[String(state)],
      result: data,
    };
    ctx.status = state || 500;
  }
  validateError(err) {
    const ctx = this.ctx;

    ctx.body = {
      code: '422',
      msg: ctx.helper.errorCode['422'],
      result: err.errors,
    };
    ctx.status = 200;
  }
  microserviceError(err) {
    const ctx = this.ctx;

    ctx.logger.error('微服务调用异常', err);
    const isEnvProd = ctx.app.config.env === 'prod';

    this.failure({
      code: 900,
      state: 200,
      msg: ctx.helper.errorCode[900],
      data: !isEnvProd ? err : {},
    });
  }
}
module.exports = BaseController;
