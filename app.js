'use strict';

// const LocalStrategy = require('passport-local').Strategy;

const crypto = require('crypto');

module.exports = app => {
  app.passport.serializeUser(async (ctx, user) => {
    // ctx.logger.debug('passport:serializeUser', user);
    return {
      username: user.username,
      password: crypto.createHash('md5').update(user.password).digest('hex'),
    };
  });

  app.passport.deserializeUser(async (ctx, user) => {
    const userInfo = await ctx.model.AuthUser.findOne({
      account: user.username,
      password: user.password,
    });

    // ctx.logger.debug('passport:deserializeUser',userInfo);

    if (!userInfo) {
      return null;
    }
    return {
      id: userInfo.id,
      userName: userInfo.name,
    };
  });
};
