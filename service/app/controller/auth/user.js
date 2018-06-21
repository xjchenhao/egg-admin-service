'use strict';
const _ = require('underscore');

const Controller = require('./../../core/baseController');

class authUserController extends Controller {
  async index(ctx) {
    const query = ctx.request.query;

    // 获取传参中指定的key，且过滤掉为`空`的条件。
    const where = _.pick(_.pick(query, ...[ 'account', 'name', 'mobile', 'email' ]), value => {
      return value !== '' && value !== undefined;
    });

    const result = await ctx.service.auth.user.index(query.currentPage, query.pageSize, where);

    this.success({
      ...result,
      list: result.list.map(obj => {
        return _.pick(obj, ...[ 'id', 'account', 'name', 'sex', 'mobile', 'email', 'remark' ]);
      }),
    });
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

      this.validateError(err);

      return;
    }

    const isAccountExist = await this.ctx.model.AuthUser.findOne({
      account: query.account,
    });

    if (isAccountExist) {
      this.failure({
        code: '-1',
        msg: '用户名已存在',
        data: {
          account: query.account,
        },
        state: 422,
      });

      return false;
    }

    const result = await ctx.service.auth.user.create(_.pick(query, ...Object.keys(createRule)));

    if (result) {
      this.success({
        id: result.id,
      }, 201);
    }

  }

  async destroy(ctx) {
    const query = ctx.params;

    const result = await ctx.service.auth.user.destroy(query.id);

    if (!result) {

      this.failure({
        data: {
          id: query.id,
        },
        state: 404,
      });

      return false;
    }

    this.success();
  }

  async edit(ctx) {
    const query = ctx.params;

    const result = await ctx.service.auth.user.edit(query.id);

    if (!result) {
      this.failure({
        data: {
          id: query.id,
        },
        state: 404,
      });

      return false;
    }


    this.success(_.pick(result, ...[ 'id', 'account', 'name', 'sex', 'mobile', 'email', 'remark' ]));
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

      this.validateError(err);

      return;
    }

    const result = await ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

    if (!result) {
      this.failure({
        data: {
          id,
        },
        state: 404,
      });

      return false;
    }

    this.success();
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

      this.validateError(err);

      return;
    }

    const result = await ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

    if (!result) {

      this.failure({
        data: {
          id,
        },
        state: 404,
      });

      return false;
    }

    this.success();
  }

  async userInfo(ctx) {
    if (!ctx.isAuthenticated()) {

      this.failure({
        code: '401',
        msg: ctx.helper.errorCode['401'],
        data: ctx.user,
        state: 401,
      });

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

    this.success({
      ...result,
      id: ctx.user.id,
    });
  }
}
module.exports = authUserController;
