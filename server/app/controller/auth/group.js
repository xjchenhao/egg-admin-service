'use strict';
let _ = require('underscore');

module.exports = app => {
  class authGroupController extends app.Controller {
    * index (ctx) {
      const query = ctx.request.query;

      // 获取传参中指定的key，且过滤掉为`空`的条件。
      let where = _.pick(_.pick(query, ...['role_name']), (value) => {
        return value !== '' && value !== undefined;
      });

      let result = yield ctx.service.auth.group.index(query.currentPage, query.pageSize, where);

      if (result) {
        ctx.body = {
          "code": "0",
          "msg": "OK",
          "result": Object.assign(result, {
            list: result.list.map((obj) => {
              return _.pick(obj, ...['id', 'role_name', 'role_summary']);
            })
          })
        }
      }
    }

    * create (ctx) {
      const query = ctx.request.body;

      const createRule = {
        role_name: {
          type: 'string',
          required: true
        },
        role_summary: {
          type: 'string',
          required: false
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
        ctx.status = 400;

        return;
      }

      const result = yield ctx.service.auth.group.create(_.pick(query, ...Object.keys(createRule)));

      if (result) {
        ctx.body = {
          "code": "0",
          "msg": "OK",
          "result": {
            id: result.insertId
          }
        }
      }

    }

    * destroy (ctx) {
      const query = ctx.params;

      const result = yield ctx.service.auth.group.destroy(query.id);

      ctx.body = {
        "code": "0",
        "msg": "OK",
        "result": {}
      }
    }

    * edit (ctx) {
      const query = ctx.params;

      const result = yield ctx.service.auth.group.edit(query.id);

      if (!result) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {}
        };
        ctx.status = 404;

        return false;
      }

      ctx.body = {
        "code": "0",
        "msg": "OK",
        "result": _.pick(result, ...['id', 'role_name', 'role_summary'])
      }
    }

    * update (ctx) {
      const id = ctx.params.id;
      const query = ctx.request.body;

      const result = yield ctx.service.auth.group.update(id, _.pick(query, ...['role_name', 'role_summary']));

      if (!result.affectedRows) {
        ctx.body = {
          code: '404',
          msg: ctx.helper.errorCode['404'],
          result: {}
        };
        ctx.status = 404;

        return false;
      }

      ctx.body = {
        "code": "0",
        "msg": "OK",
        "result": {}
      }
    }

    * getUser (ctx) {
      const query = ctx.params;

      let addResult = yield this.app.mysql.get('back').select('back_user_role', {
        where: {
          role_id: query.id
        }
      });

      let addArr = [];
      addResult.forEach((obj) => {
        addArr.push(obj.user_id)
      });

      let allResult = yield this.app.mysql.get('back').select('back_user');

      let allArr = [];
      allResult.forEach((obj) => {
        allArr.push({
          key: obj.id,
          label: obj.user_name
        })
      });

      ctx.body = {
        "code": "0",
        "msg": "OK",
        "result": {
          addList: addArr,
          allList: allArr
        }
      }
    }

    * setUser (ctx) {
      const roleId = ctx.params.id;
      const idList = ctx.request.body.idList ? ctx.request.body.idList.split(',') : [];

      // 错误捕捉
      {
        let roleResult = yield this.app.mysql.get('back').get('back_role', {
          id: roleId
        });

        let userResult = yield this.app.mysql.get('back').select('back_user');
        if (!roleResult) {
          ctx.body = {
            code: '404',
            msg: ctx.helper.errorCode['404'],
            result: {
              id: roleId
            }
          };
          ctx.status = 404;

          return false;
        }


        let isExistUserId = (() => {
          let exist = true;

          let sysUserList = _.chain(userResult)
            .pluck('id')
            .map((id) => {
              return String(id)
            })
            .value();

          idList.forEach((id) => {
            if (sysUserList.indexOf(id) === -1) {
              exist = false;

              return false;
            }
          });

          return exist;
        })();

        if (!isExistUserId) {
          ctx.body = {
            code: '404',
            msg: ctx.helper.errorCode['404'],
            result: {
              idList
            }
          };
          ctx.status = 404;

          return false;
        }
      }

      // 清空掉该用户相关的角色关联
      yield this.app.mysql.get('back').delete('back_user_role', {
        role_id: roleId
      });

      // 建立新的角色关联
      for (let i = 0, l = idList.length; i < l; i++) {
        yield this.app.mysql.get('back').insert('back_user_role', {
          role_id: roleId,
          user_id: idList[i]
        });
      }

      ctx.body = {
        "code": "0",
        "msg": "OK",
        "result": {}
      }
    }

    * getModule (ctx) {
      const query = ctx.params;

      let addResult = yield this.app.mysql.get('back').select('back_role_module', {
        where: {
          role_id: query.id
        }
      });

      let addArr = [];
      addResult.forEach((obj) => {
        addArr.push(obj.module_id)
      });

      let allResult = yield ctx.service.auth.module.system({
        module_parent_id: query.module_parent_id
      });

      ctx.body = {
        "code": "0",
        "msg": "OK",
        "result": {
          addList: addArr,
          allList: allResult
        }
      }
    }

    * setModule (ctx) {
      const roleId = ctx.params.id;
      const idList = ctx.request.body.idList ? ctx.request.body.idList.split(',') : [];

      // 错误捕捉
      {
        let roleResult = yield this.app.mysql.get('back').get('back_role', {
          id: roleId
        });

        let userResult = yield this.app.mysql.get('back').select('back_module');
        if (!roleResult) {
          ctx.body = {
            code: '404',
            msg: ctx.helper.errorCode['404'],
            result: {
              id: roleId
            }
          };
          ctx.status = 404;

          return false;
        }


        let isExistModuleId = (() => {
          let exist = true;

          let sysUserList = _.chain(userResult)
            .pluck('id')
            .map((id) => {
              return String(id)
            })
            .value();

          idList.forEach((id) => {
            if (sysUserList.indexOf(id) === -1) {
              exist = false;

              return false;
            }
          });

          return exist;
        })();

        if (!isExistModuleId) {
          ctx.body = {
            code: '404',
            msg: ctx.helper.errorCode['404'],
            result: {
              idList
            }
          };
          ctx.status = 404;

          return false;
        }
      }

      yield this.app.mysql.get('back').delete('back_role_module', {
        role_id: roleId
      });
      for (let i = 0, l = idList.length; i < l; i++) {
        yield this.app.mysql.get('back').insert('back_role_module', {
          role_id: roleId,
          module_id: idList[i]
        });
      }

      ctx.body = {
        "code": "0",
        "msg": "OK",
        "result": {}
      }
    }
  }
  return authGroupController;
};