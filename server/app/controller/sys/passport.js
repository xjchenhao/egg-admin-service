'use strict';

const crypto = require('crypto');

module.exports = app => {
    class sysController extends app.Controller {

        async logout (ctx) {
            ctx.logout();

            ctx.body = {
                code: '0',
                msg: '退出登录成功',
                result: {},
            };
            ctx.status = 200;
        }

        async login (ctx) {

            let userInfo = await ctx.model.AuthUser.findOne({
                account: ctx.query.username,
                password: crypto.createHash('md5').update(ctx.query.password).digest('hex'),
            })

            if (userInfo) {
                ctx.login({
                    username: ctx.query.username,
                    password: ctx.query.password,
                });

                let groupNameList = [];
                for (let i = 0, l = userInfo.groups.length; i < l; i++) {
                    let result = await ctx.model.AuthGroup.findOne({
                        _id: userInfo.groups[i],
                    }, {
                            name: 1,
                        });
                    groupNameList.push(result.name);
                }

                ctx.body = {
                    "code": "0",
                    "msg": "登录成功",
                    "result": {
                        id: userInfo._id,
                        userName: userInfo.name,
                        groupName: groupNameList,
                    }
                }
                ctx.status = 200;
            } else {
                ctx.body = {
                    "code": '1',
                    "msg": "账号或密码错误",
                    "result": {}
                }
                ctx.status = 200;
            }
        }
    }
    return sysController;
}
