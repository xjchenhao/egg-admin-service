'use strict';

const crypto = require('crypto');
let _ = require('underscore');

module.exports = app => {
    class sysController extends app.Controller {

        async logout (ctx) {
            ctx.logout();

            ctx.body = {
                "code": "0",
                "msg": "退出登录成功",
                "result": {}
            }
        }

        async login (ctx) {
            let [userInfo] = await ctx.app.mysql.get('back').select('back_user', {
                where: {
                    user_account: ctx.query.username,
                    user_password: crypto.createHash('md5').update(ctx.query.password).digest('hex'),
                },
            });

            if (userInfo) {
                ctx.login({
                    username: ctx.query.username,
                    password: ctx.query.password,
                });

                ctx.body = {
                    "code": "0",
                    "msg": "登录成功",
                    "result": {}
                }
            } else {
                ctx.body = {
                    "code": '1',
                    "msg": "账号或密码错误",
                    "result": {}
                }

            }
        }
    }
    return sysController;
};