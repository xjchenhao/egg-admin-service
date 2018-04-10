'use strict';

module.exports = (action) => {
    return async function (ctx, next) {
        await next();

        const isLogin = ctx.isAuthenticated();
        const userInfo = ctx.user;

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

        const result = await (ctx.app.mysql.get('back').query('select distinct bm.* from role_module rm left join module bm on rm.module_id=bm.id left join user_role ur on rm.role_id=ur.role_id WHERE ur.user_id=? AND bm.uri=?', [userInfo.id, action]));

        ctx.logger.info('permission:', {
            userId: userInfo.id,
            action,
        }, '=> ' + !!result.length);

        if (!result.length) {
            if (ctx.acceptJSON) {
                ctx.body = {
                    code: '403',
                    msg: ctx.helper.errorCode['403'],
                    result: {
                        userId: userInfo,
                        uri: action,
                    },
                };
                ctx.status = 403;
            } else {
                ctx.redirect('/login?redirect=' + encodeURIComponent(ctx.originalUrl));
            }

            return false;
        }
    };
}