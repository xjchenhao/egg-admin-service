'use strict';
const _ = require('underscore');

module.exports = app => {
  class authGroupController extends app.Controller {
    async index (ctx) {
      const query = ctx.request.query;

      // 获取传参中指定的key，且过滤掉为`空`的条件。
      const where = _.pick(_.pick(query, ...['name']), value => {
        return value !== '' && value !== undefined;
      });

      const result = await ctx.service.auth.group.index(query.currentPage, query.pageSize, where);

      if (result) {
        ctx.body = {
          code: '0',
          msg: 'OK',
          result: result,
        };
      }
    }

    async create (ctx) {
      const query = ctx.request.body;

      const createRule = {
        name: {
          type: 'string',
          required: true,
        },
        summary: {
          type: 'string',
          required: false,
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
        ctx.status = 400;

        return;
      }

      const isExist = await this.ctx.model.AuthGroup.findOne({
        name: query.name,
      });

      if (isExist) {
        ctx.body = {
          code: '-1',
          msg: '组名已存在',
          result: {
            name: query.name,
          }
        }
        ctx.status = 200;

        return false;
      }

      const result = await ctx.service.auth.group.create(_.pick(query, ...Object.keys(createRule)));

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

    async destroy (ctx) {
      const query = ctx.params;

      await ctx.service.auth.group.destroy(query.id);

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {},
      };
      ctx.status = 200;
    }

    async edit (ctx) {
      const query = ctx.params;

      const result = await ctx.service.auth.group.edit(query.id);

      if (!result) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {},
        };
        ctx.status = 404;

        return false;
      }

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: _.pick(result, ...['id', 'name', 'summary']),
      };
    }

    async update (ctx) {
      const id = ctx.params.id;
      const query = ctx.request.body;

      const isExist = await this.ctx.model.AuthGroup.findOne({
        _id: {
          '$ne': id,
        },
        name: query.name,
      });
      if (isExist) {
        ctx.body = {
          code: '-1',
          msg: '组名已存在',
          result: {
            name: query.name,
          }
        }
        ctx.status = 200;

        return false;
      }

      const result = await ctx.service.auth.group.update(id, _.pick(query, ...['name', 'describe']));

      if (!result) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {},
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

    async getUser (ctx) {
      const query = ctx.params;

      const addArr = (await ctx.model.AuthGroup.findOne({
        _id: query.id
      })).users;

      const allResult = await ctx.model.AuthGroup.find();

      const allArr = [];
      allResult.forEach(obj => {
        allArr.push({
          key: obj._id,
          label: obj.name,
        });
      });

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {
          addList: addArr ? addArr : [],
          allList: allArr,
        },
      };
    }

    async setUser (ctx) {
      const roleId = ctx.params.id;
      const idList = ctx.request.body.idList;

      // 给用户组集合插入user信息
      const result = await ctx.model.AuthGroup.findByIdAndUpdate(roleId, {
        $set: {
          users: idList
        }
      });

      if (result === null) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {
            idList,
          },
        };
        ctx.status = 404;

        return false;
      }

      // 给用户集合插入groups信息
      for (let i = 0, l = idList.length; i < l; i++) {
        let userGroups = await ctx.model.AuthUser.find({
          _id: idList[i]
        }).groups;

        userGroups = userGroups ? userGroups : [];

        if (userGroups.indexOf(roleId) === -1) {
          userGroups.push(roleId)
        }
        await ctx.model.AuthUser.findByIdAndUpdate({
          _id: idList[i]
        }, {
            $set: {
              groups: userGroups,
            }
          });
      }

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {},
      };
    }

    async getModule (ctx) {
      const query = ctx.params;

      const addArr = (await ctx.model.AuthGroup.findOne({
        _id: query.id
      })).modules;

      const allResult = await ctx.model.AuthModule.find();

      const allArr = [];
      allResult.forEach(obj => {
        allArr.push({
          key: obj._id,
          label: obj.name,
        });
      });

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {
          addList: addArr ? addArr : [],
          allList: allArr,
        },
      };
    }

    async setModule (ctx) {
      const roleId = ctx.params.id;
      const idList = ctx.request.body.idList;

      // 给用户组集合插入user信息
      const result = await ctx.model.AuthGroup.findByIdAndUpdate(roleId, {
        $set: {
          modules: idList
        }
      });

      if (result === null) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {
            idList,
          },
        };
        ctx.status = 404;

        return false;
      }

      // 给用户集合插入groups信息
      for (let i = 0, l = idList.length; i < l; i++) {
        let userGroups = await ctx.model.AuthModule.find({
          _id: idList[i]
        }).groups;

        userGroups = userGroups ? userGroups : [];

        if (userGroups.indexOf(roleId) === -1) {
          userGroups.push(roleId)
        }
        await ctx.model.AuthModule.findByIdAndUpdate({
          _id: idList[i]
        }, {
            $set: {
              groups: userGroups,
            }
          });
      }

      ctx.body = {
        code: '0',
        msg: 'OK',
        result: {},
      };
    }
  }
  return authGroupController;
};
