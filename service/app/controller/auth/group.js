'use strict';
const _ = require('underscore');
const Controller = require('./../../core/baseController');

class authGroupController extends Controller {
  async index(ctx) {
    const query = ctx.request.query;

    // 获取传参中指定的key，且过滤掉为`空`的条件。
    const where = _.pick(_.pick(query, ...[ 'name' ]), value => {
      return value !== '' && value !== undefined;
    });

    const result = await ctx.service.auth.group.index(query.currentPage, query.pageSize, where);

    if (result) {
      this.success({
        ...result,
        list: result.list.map(obj => {
          return _.pick(obj, ...[ 'id', 'name', 'describe' ]);
        }),
      });
    }
  }

  async create(ctx) {
    const query = ctx.request.body;

    const createRule = {
      name: {
        type: 'string',
        required: true,
      },
      describe: {
        type: 'string',
        required: false,
      },
    };

    try {
      ctx.validate(createRule);
    } catch (err) {

      this.validateError(err);

      return;
    }

    const isExist = await this.ctx.model.AuthGroup.findOne({
      name: query.name,
    });

    if (isExist) {

      this.failure({
        code: '-1',
        msg: '组名已存在',
        data: {
          name: query.name,
        },
        state: 422,
      });

      return false;
    }

    const result = await ctx.service.auth.group.create(_.pick(query, ...Object.keys(createRule)));

    if (result) {

      this.success({
        id: result.id,
      }, 201);
    }

  }

  async destroy(ctx) {
    const query = ctx.params;

    await ctx.service.auth.group.destroy(query.id);

    this.success();
  }

  async edit(ctx) {
    const query = ctx.params;

    const result = await ctx.service.auth.group.edit(query.id);

    if (!result) {

      this.failure({
        data: {},
        state: 404,
      });

      return false;
    }

    this.success(_.pick(result, ...[ 'id', 'name', 'describe' ]));
  }

  async update(ctx) {
    const id = ctx.params.id;
    const query = ctx.request.body;

    const isExist = await this.ctx.model.AuthGroup.findOne({
      _id: {
        $ne: id,
      },
      name: query.name,
    });
    if (isExist) {
      this.failure({
        code: '-1',
        msg: '组名已存在',
        data: {
          name: query.name,
        },
        state: 422,
      });

      return false;
    }

    const result = await ctx.service.auth.group.update(id, _.pick(query, ...[ 'name', 'describe' ]));

    if (!result) {
      this.failure({
        data: {},
        state: 404,
      });

      return false;
    }

    this.success();
  }

  async getUser(ctx) {
    const query = ctx.params;

    const addArr = (await ctx.model.AuthGroup.findOne({
      _id: query.id,
    })).users;

    const allResult = await ctx.model.AuthUser.find();

    const allArr = [];
    allResult.forEach(obj => {
      allArr.push({
        key: obj._id,
        label: obj.name,
      });
    });

    this.success({
      addList: addArr ? addArr : [],
      allList: allArr,
    });
  }

  async setUser(ctx) {
    const roleId = ctx.params.id;
    const idList = ctx.request.body.idList;

    const result = await ctx.model.AuthGroup.findByIdAndUpdate(roleId, {
      $set: {
        users: idList,
      },
    });

    if (result === null) {
      this.failure({
        data: {
          idList,
        },
        state: 404,
      });

      return false;
    }

    this.success();
  }

  async getModule(ctx) {
    const query = ctx.params;

    const addArr = (await ctx.model.AuthGroup.findOne({
      _id: query.id,
    })).modules;

    const allResult = await ctx.service.auth.module.system({
      parentId: query.parent_id || '',
    });

    this.success({
      addList: addArr ? addArr : [],
      allList: allResult,
    });
  }

  async setModule(ctx) {
    const roleId = ctx.params.id;
    const idList = ctx.request.body.idList;

    // 给用户组集合插入user信息
    const result = await ctx.model.AuthGroup.findByIdAndUpdate(roleId, {
      $set: {
        modules: idList,
      },
    });

    if (result === null) {
      this.failure({
        data: {
          idList,
        },
        state: 404,
      });

      return false;
    }

    this.success();
  }
}
module.exports = authGroupController;
