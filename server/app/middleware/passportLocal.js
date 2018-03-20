'use strict';

module.exports = () => {
  return async function (ctx, next) {
    let { req, res, app } = ctx;
    await next();

    await app.passport.authenticate('local', async function (err, user, info) {
      ctx.body = {
        code: '0',
        msg: 'ok',
        result: {

        },
      };
    })(ctx, next);
  };
}