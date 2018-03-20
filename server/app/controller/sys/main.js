'use strict';

const crypto = require('crypto');
let _ = require('underscore');

module.exports = app => {
    class sysController extends app.Controller {
        * login (ctx,a,b) {
            console.log('进入了Controller');
            console.log(ctx.body);
            console.log(a);
            console.log(b);

            // ctx.body = {
            //     "code": "0",
            //     "msg": "退出登录成功",
            //     "result": {}
            // }
            // const { userName, password } = ctx.request.query;
            // // ctx.login(userName, password);
            // // console.log(userName);
            // // app.passport.authenticate(userName, { successRedirect: '/authCallback' })

            // let list = yield this.app.mysql.get('back').select('back_user', {
            //     where: {
            //         user_account: userName,
            //         user_password: crypto.createHash('md5').update(password).digest('hex'),
            //     },
            // });
            // // console.log(app.passport.authenticate.toString());
            // app.passport.authenticate({
            //     usernameField:'usernameField',
            //     passwordField:'passwordField'
            // });
            // if (list.length) {
            //     ctx.login(userName, {
            //         a: 1
            //     })
            //     // 调用 rotateCsrfSecret 刷新用户的 CSRF token
            //     ctx.rotateCsrfSecret();
                
            //     ctx.body = {
            //         "code": "0",
            //         "msg": "OK",
            //         "result": {}
            //     }
            // } else {
            //     ctx.body = {
            //         "code": "1000",
            //         "msg": "请输入正确的账号或密码",
            //         "result": {}
            //     }
            // }


            // if (list.length) {

            //     ctx.isAuthenticated() = {
            //         id: list[0].id,
            //         name: list[0].user_name,
            //     };

            //     // 调用 rotateCsrfSecret 刷新用户的 CSRF token
            //     ctx.rotateCsrfSecret();

            //     ctx.body = {
            //         "code": "0",
            //         "msg": "OK",
            //         "result": {}
            //     }
            // } else {

            //     ctx.body = {
            //         "code": "1000",
            //         "msg": "请输入正确的账号或密码",
            //         "result": {}
            //     }
            // }
        }

        * logout (ctx) {
            ctx.session = null;

            ctx.body = {
                "code": "0",
                "msg": "退出登录成功",
                "result": {}
            }
        }

        * userInfo (ctx) {
            if (!ctx.isAuthenticated()) {
                ctx.body = {
                    code: ctx.helper.errorCode.NOTLOGIN,
                    msg: '账号未登录',
                    result: ctx.user,
                };

                return false;
            }

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": ctx.isAuthenticated()
            }
        }

        * sidebar (ctx) {
            if (!ctx.isAuthenticated()) {
                ctx.body = {
                    code: ctx.helper.errorCode.NOTLOGIN,
                    msg: '账号未登录',
                    result: ctx.user,
                };

                return false;
            }

            // 使用 mysql.escape 方法,做复杂的表关联查询
            const result = yield ctx.app.mysql.get('back').query('select distinct bm.* from back_role_module rm left join back_module bm on rm.module_id=bm.id left join back_user_role ur on rm.role_id=ur.role_id WHERE ur.user_id=? AND bm.module_show=1', [ctx.isAuthenticated().id]);

            // 根据父级id遍历子集
            const subset = function (parentId) {
                const arr = [];

                // 查询该id下的所有子集
                result.forEach(function (obj) {
                    if (obj.module_parent_id === parentId) {
                        arr.push(Object.assign(obj, {
                            children: subset(obj.id),
                        }));
                    }
                });

                // 如果没有子集 直接退出
                if (arr.length === 0) {
                    return [];
                }

                // 对子集进行排序
                arr.sort(function (val1, val2) {
                    if (val1.module_sort < val2.module_sort) {
                        return -1;
                    } else if (val1.module_sort > val2.module_sort) {
                        return 1;
                    }
                    return 0;

                });

                return arr;
            };

            const convert = function (arr) {
                const arrMap = [];
                arr.forEach(obj => {
                    arrMap.push({
                        menuIcon: obj.module_iconfont,
                        menuName: obj.module_name,
                        menuUrl: obj.module_url,
                        describe: obj.module_describe,
                        childrens: obj.children && convert(obj.children),
                    });
                });
                return arrMap;
            };

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": convert(subset(0))
            }
        }
    }
    return sysController;
};