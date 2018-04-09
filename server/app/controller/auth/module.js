'use strict';
let _ = require('underscore');

module.exports = app => {
    class authMenuController extends app.Controller {
        * index (ctx) {
            const query = ctx.request.query;

            // 获取传参中指定的key，且过滤掉为`空`的条件。
            let where = _.pick(_.pick(query, ...['name', 'url', 'uri', 'parent_id']), (value) => {
                return value !== '' && value !== undefined;
            });

            const result = yield ctx.service.auth.module.index(Number(query.currentPage), Number(query.pageSize), where);

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": Object.assign(result, {
                    list: result.list.map((obj) => {
                        return _.pick(obj, ...['id', 'name', 'url', 'uri', 'iconfont', 'describe', 'sort', 'show', 'parent_id', 'parent_name']);
                    })
                })
            }
        }

        * create (ctx) {
            const query = ctx.request.body;

            const createRule = {
                name: {
                    type: 'string',
                    required: true
                },
                url: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                uri: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                iconfont: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                describe: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                sort: {
                    type: 'number',
                    required: true
                },
                show: {
                    type: 'number',
                    required: false,
                    allowEmpty: true,
                },
                parent_id: {
                    type: 'string',
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

        * destroy (ctx) {
            const query = ctx.params;

            const result = yield ctx.service.auth.module.destroy(query.id);

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": {}
            }
            ctx.status = 200;
        }

        * edit (ctx) {
            const query = ctx.params;

            const result = yield ctx.service.auth.module.edit(query.id);

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": _.pick(result, ...['id', 'name', 'url', 'uri', 'iconfont', 'describe', 'sort', 'show', 'parent_id'])
            }
        }

        * update (ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                name: {
                    type: 'string',
                    required: true
                },
                url: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                uri: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                iconfont: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                describe: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                sort: {
                    type: 'number',
                    required: true
                },
                show: {
                    type: 'number',
                    required: false,
                    allowEmpty: true,
                },
                parent_id: {
                    type: 'string',
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
                "result": {
                    id: result.insertId
                }
            }
            ctx.status = 201;
        }

        * system (ctx) {
            const query = ctx.request.query;

            const result = yield ctx.service.auth.module.system({});

            ctx.body = {
                "code": "0",
                "msg": "OK",
                "result": result
            }
        }
    }
    return authMenuController;
};