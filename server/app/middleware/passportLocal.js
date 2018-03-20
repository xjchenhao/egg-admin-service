'use strict';

module.exports = () => {
  return async function (ctx, next) {
    let { req, res, app } = ctx;
    await next();

    // await app.passport.authenticate('local', { successRedirect: '/nodeApi/auth/users',failureRedirect: '/nodeApi/auth/users' })(ctx, next);
  };
}