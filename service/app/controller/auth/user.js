'use strict';
const _ = require('underscore');

module.exports = app => {
  class authUserController extends app.Controller {
    async index(ctx) {
      const query = ctx.request.query;

      // 获取传参中指定的key，且过滤掉为`空`的条件。
      const where = _.pick(_.pick(query, ...[ 'account', 'name', 'mobile', 'email' ]), value => {
        return value !== '' && value !== undefined;
      });

      const result = await ctx.service.auth.user.index(query.currentPage, query.pageSize, where);

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: Object.assign(result, {
          list: result.list.map(obj => {
            return _.pick(obj, ...[ 'id', 'account', 'name', 'sex', 'mobile', 'email', 'remark' ]);
          }),
        }),
      };
    }

    async create(ctx) {
      const query = ctx.request.body;

      const createRule = {
        account: {
          type: 'string',
          required: true,
        },
        name: {
          type: 'string',
          required: true,
        },
        mobile: {
          type: 'string',
          required: false,
          allowEmpty: true,
        },
        email: {
          type: 'email',
          required: false,
          allowEmpty: true,
        },
        password: {
          type: 'string',
          required: true,
        },
      };

      try {
        ctx.validate(createRule);
      } catch (err) {

        this.ctx.body = {
          code: '400',
          msg: ctx.helper.errorCode['400'],
          result: err.errors,
        };
        this.ctx.status = 400;

        return;
      }

      const isAccountExist = await this.ctx.model.AuthUser.findOne({
        account: query.account,
      });

      if (isAccountExist) {
        ctx.body = {
          code: '-1',
          msg: '用户名已存在',
          result: {
            account: query.account,
          },
        };
        ctx.status = 200;

        return false;
      }

      const result = await ctx.service.auth.user.create(_.pick(query, ...Object.keys(createRule)));

      if (result) {
        ctx.body = {
          code: '0',
          msg: 'OK',
          result: {
            id: result.insertId,
          },
        };
        ctx.status = 201;
      }

    }

    async destroy(ctx) {
      const query = ctx.params;

      const result = await ctx.service.auth.user.destroy(query.id);

      if (!result) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {
            id: query.id,
          },
        };
        ctx.status = 404;

        return false;
      }

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {},
      };
      ctx.status = 200;
    }

    async edit(ctx) {
      const query = ctx.params;

      const result = await ctx.service.auth.user.edit(query.id);

      if (!result) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {
            id: query.id,
          },
        };
        ctx.status = 404;

        return false;
      }

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: _.pick(result, ...[ 'id', 'account', 'name', 'sex', 'mobile', 'email', 'remark' ]),
      };
    }

    async update(ctx) {
      const id = ctx.params.id;
      const query = ctx.request.body;

      const createRule = {
        account: {
          type: 'string',
          required: true,
        },
        name: {
          type: 'string',
          required: true,
        },
        mobile: {
          type: 'string',
          required: false,
          allowEmpty: true,
        },
        email: {
          type: 'email',
          required: false,
          allowEmpty: true,
        },
      };

      try {
        ctx.validate(createRule);
      } catch (err) {

        this.ctx.body = {
          code: '400',
          msg: ctx.helper.errorCode['400'],
          result: err.errors,
        };
        this.ctx.status = 400;

        return;
      }

      const result = await ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

      if (!result) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {
            id,
          },
        };
        ctx.status = 404;

        return false;
      }

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {},
      };
    }

    async setPassword(ctx) {
      const id = ctx.params.id;
      const query = ctx.request.body;

      const createRule = {
        password: {
          type: 'string',
          required: true,
        },
      };

      try {
        ctx.validate(createRule);
      } catch (err) {

        this.ctx.body = {
          code: '400',
          msg: ctx.helper.errorCode['400'],
          result: err.errors,
        };
        this.ctx.status = 400;

        return;
      }

      const result = await ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

      if (!result) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {
            id,
          },
        };
        ctx.status = 404;

        return false;
      }

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {},
      };
    }

    async userInfo(ctx) {
      if (!ctx.isAuthenticated()) {
        ctx.body = {
          code: '401',
          msg: ctx.helper.errorCode['401'],
          result: ctx.user,
        };
        ctx.status = 401;

        return false;
      }

      const result = (await ctx.model.AuthUser.findOne({
        _id: ctx.user.id,
      }, {
        _id: 0,
        account: 1,
        name: 1,
        email: 1,
        mobile: 1,
      })).toJSON();

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {
          ...result,
          id: ctx.user.id,
        },
      };
      ctx.realStatus = 200;
    }
  }
  return authUserController;
};
