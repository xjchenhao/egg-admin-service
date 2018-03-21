'use strict';
let _ = require('underscore');

module.exports = app => {
    class authMenuController extends app.Controller {
        * index(ctx) {
            const query = ctx.request.query;

            // 获取传参中指定的key，且过滤掉为`空`的条件。
            let where = _.pick(_.pick(query, ...['module_name', 'module_url', 'module_uri', 'module_parent_id']), (value) => {
                return value !== '' && value !== undefined;
            });

            const result = yield ctx.service.auth.module.index(query.currentPage, query.pageSize, where);

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": Object.assign(result, {
                    list: result.list.map((obj) => {
                        return _.pick(obj, ...['id', 'module_name', 'module_url', 'module_uri', 'module_iconfont', 'module_describe', 'module_sort', 'module_show', 'module_parent_id', 'module_parent_name']);
                    })
                })
            }
        }

        * create(ctx) {
            const query = ctx.request.body;

            const createRule = {
                module_name: {
                    type: 'string',
                    required: true
                },
                module_url: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_uri: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_iconfont: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_describe: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_sort: {
                    type: 'number',
                    required: true
                },
                module_show: {
                    type: 'number',
                    required: false,
                    allowEmpty: true,
                },
                module_parent_id: {
                    type: 'number',
                    required: false,
                    allowEmpty: true,
                },
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                  "code": '400',
                  "msg": ctx.helper.errorCode['400'],
                  "result": err.errors
                };
                this.ctx.status = 400;

                return;
            }

            const result = yield ctx.service.auth.module.create(_.pick(query, ...Object.keys(createRule)));

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": {}
            }

        }

        * destroy(ctx) {
            const query = ctx.params;

            const result = yield ctx.service.auth.module.destroy(query.id);

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": {}
            }
        }

        * edit(ctx) {
            const query = ctx.params;

            const result = yield ctx.service.auth.module.edit(query.id);

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": _.pick(result, ...['id', 'module_name', 'module_url', 'module_uri', 'module_iconfont', 'module_describe', 'module_sort', 'module_show', 'module_parent_id'])
            }
        }

        * update(ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                module_name: {
                    type: 'string',
                    required: true
                },
                module_url: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_uri: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_iconfont: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_describe: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                module_sort: {
                    type: 'number',
                    required: true
                },
                module_show: {
                    type: 'number',
                    required: false,
                    allowEmpty: true,
                },
                module_parent_id: {
                    type: 'number',
                    required: false,
                    allowEmpty: true,
                },
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                  "code": '400',
                  "msg": ctx.helper.errorCode['400'],
                  "result": err.errors
                };
                this.ctx.status = 400;

                return;
            }

            const result = yield ctx.service.auth.module.update(id, _.pick(query, ...Object.keys(createRule)));

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": {}
            }
        }

        * system(ctx) {
            const query = ctx.request.query;

            const result = yield ctx.service.auth.module.system({
                module_parent_id: query.module_parent_id
            });

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": result
            }
        }
    }
    return authMenuController;
};