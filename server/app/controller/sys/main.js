'use strict';

const crypto = require('crypto');
let _ = require('underscore');

module.exports = app => {
    class sysController extends app.Controller {

        async userInfo (ctx) {
            if (!ctx.isAuthenticated()) {
                ctx.body = {
                    code: '401',
                    msg: ctx.helper.errorCode['401'],
                    result: ctx.user,
                };
                ctx.status = 401;

                return false;
            }
            ctx.logger.debug('userInfo',ctx.user);

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": ctx.user
            }
            ctx.realStatus = 200;
        }

        async sidebar (ctx) {
            if (!ctx.isAuthenticated()) {
                ctx.body = {
                    code: '401',
                    msg: ctx.helper.errorCode['401'],
                    result: ctx.user,
                };
                ctx.status = 401;

                return false;
            }

            // 使用 mysql.escape 方法,做复杂的表关联查询
            const result = await ctx.app.mysql.get('back').query('select distinct bm.* from back_role_module rm left join back_module bm on rm.module_id=bm.id left join back_user_role ur on rm.role_id=ur.role_id WHERE ur.user_id=? AND bm.module_show=1', [ctx.user.id]);

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