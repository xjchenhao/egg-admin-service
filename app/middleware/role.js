'use strict';

module.exports = action => {
  return async function(ctx, next) {

    const isLogin = ctx.isAuthenticated();
    const userInfo = ctx.user;

    const noAccess = () => {
      ctx.body = {
        code: '403',
        msg: ctx.helper.errorCode['403'],
        result: {
          userId: userInfo,
          uri: action,
        },
      };
      ctx.status = 403;
    };

    if (!isLogin) {
      if (ctx.acceptJSON) {
        ctx.body = {
          code: '401',
          msg: ctx.helper.errorCode['401'],
          result: {
            userId: userInfo,
            uri: action,
          },
        };
        ctx.status = 401;
      } else {
        ctx.redirect('/login?redirect=' + encodeURIComponent(ctx.originalUrl));
      }

      return false;
    }

    const groupsList = await ctx.model.AuthGroup.find({
      users: userInfo.id,
    });

    if (groupsList === null || !groupsList.length) {
      noAccess();
    }

    for (let i = 0, l = groupsList.length; i < l; i++) {
      const uriId = (await ctx.model.AuthModule.findOne({
        uri: action,
      })).id;

      const result = await ctx.model.AuthGroup.findOne({
        _id: groupsList[i],
        modules: uriId,
      });
      if (result) {
        await next();

        return true;
      }
    }
    noAccess();
  };
};
