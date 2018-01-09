'use strict';
let _ = require('underscore');


module.exports = app => {
    class authUserController extends app.Controller {

        * edit(ctx) {
            const query = ctx.params;

            if (ctx.session.userInfo.id !== Number(query.id)) {
                ctx.body = {
                    code: ctx.helper.errorCode.PERMISSION,
                    msg: 'sorry，该用户无权限访问',
                    result: {
                        userId: ctx.session.userInfo,
                        uri: '',
                    },
                };
                return false;
            }


            const result = yield ctx.service.auth.user.edit(query.id);

            if (!result) {
                ctx.body = {
                    code: ctx.helper.errorCode.FOUND,
                    msg: '未找到对应id',
                    result: {}
                };

                ctx.logger.error(`未找到对应id`);

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: _.pick(result, ...['id', 'user_account', 'user_name', 'user_sex', 'user_mobile', 'user_email', 'remark'])
            }
        }

        * update(ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                user_account: {
                    type: 'string',
                    required: true
                },
                user_name: {
                    type: 'string',
                    required: true
                },
                user_mobile: {
                    type: 'string',
                    required: false,
                    allowEmpty: true
                },
                user_email: {
                    type: 'email',
                    required: false,
                    allowEmpty: true
                }
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                    code: ctx.helper.errorCode.FORMAT,
                    msg: err.message,
                    result: err.errors
                };

                return;
            }

            const result = yield ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

            if (!result.affectedRows) {
                ctx.body = {
                    code: ctx.helper.errorCode.FOUND,
                    msg: '未找到对应id',
                    result: {}
                };

                ctx.logger.error(`未找到对应id`);

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: {}
            }
        }

        * setPassword(ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                user_password: {
                    type: 'string',
                    required: true,
                },
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                    code: ctx.helper.errorCode.FORMAT,
                    msg: err.message,
                    result: err.errors
                };

                return;
            }

            const result = yield ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

            if (!result.affectedRows) {
                ctx.body = {
                    code: ctx.helper.errorCode.FOUND,
                    msg: '未找到对应id',
                    result: {}
                };

                ctx.logger.error(`未找到对应id`);

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: {}
            }
        }
    }
    return authUserController;
};