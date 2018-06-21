'use strict';
const _ = require('underscore');
const Controller = require('./../../core/baseController');

class authMenuController extends Controller {
  async index(ctx) {
    const query = ctx.request.query;

    // 获取传参中指定的key，且过滤掉为`空`的条件。
    const where = _.pick(_.pick(query, ...[ 'name', 'url', 'uri', 'parent_id' ]), value => {
      return value !== '' && value !== undefined;
    });

    const result = await ctx.service.auth.module.index(Number(query.currentPage), Number(query.pageSize), where);

    ctx.body = {
      code: '0',
      msg: 'OK',
      result: Object.assign(result, {
        list: result.list.map(obj => {
          return _.pick(obj, ...[ 'id', 'name', 'url', 'uri', 'iconfont', 'describe', 'sort', 'show', 'parent_id', 'parent_name' ]);
        }),
      }),
    };
  }

  async create(ctx) {
    const query = ctx.request.body;

    const createRule = {
      name: {
        type: 'string',
        required: true,
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
        required: false,
        allowEmpty: true,
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

      this.validateError(err);

      return;
    }


    if (query.uri) {
      const isExist = await this.ctx.model.AuthModule.findOne({
        uri: query.uri,
      });

      if (isExist) {

        this.failure({
          code: '-1',
          msg: 'uri已存在',
          data: {
            uri: query.uri,
          },
          state: 422,
        });

        return false;
      }
    }

    const result = await ctx.service.auth.module.create(_.pick(query, ...Object.keys(createRule)));

    this.success({
      id: result.id,
    });

  }

  async destroy(ctx) {
    const query = ctx.params;

    const isExist = await this.ctx.model.AuthModule.findOne({
      _id: query.id,
    });
    if (!isExist) {

      this.failure({
        code: '-1',
        msg: 'id不存在',
        data: {
          uri: query.uri,
        },
      });

      return false;
    }

    await ctx.service.auth.module.destroy(query.id);

    this.success({
      uri: query.uri,
    });
  }

  async edit(ctx) {
    const query = ctx.params;

    const result = await ctx.service.auth.module.edit(query.id);

    this.success(_.pick(result, ...[ 'id', 'name', 'url', 'uri', 'iconfont', 'describe', 'sort', 'show', 'isMenu', 'url', 'parent_id' ]));
  }

  async update(ctx) {
    const id = ctx.params.id;
    const query = ctx.request.body;

    const createRule = {
      name: {
        type: 'string',
        required: true,
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
      isMenu: {
        type: 'boolean',
        required: false,
        allowEmpty: true,
      },
      sort: {
        type: 'number',
        required: false,
        allowEmpty: true,
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


      this.validateError(err);

      return;
    }

    const isUriExist = await this.ctx.model.AuthModule.findOne({
      _id: {
        $ne: id,
      },
      uri: query.uri,
    });
    if (isUriExist) {

      this.failure({
        code: '-1',
        msg: 'uri已存在',
        data: {
          uri: query.uri,
        },
        state: 422,
      });

      return false;
    }

    const result = await ctx.service.auth.module.update(id, _.pick(query, ...Object.keys(createRule)));

    this.success({
      id: result.insertId,
    }, 201);
  }

  async system(ctx) {

    const result = await ctx.service.auth.module.system({});

    this.success(result);
  }
}
module.exports = authMenuController;
