'use strict';

const crypto = require('crypto');

module.exports = app => {
  class sysController extends app.Controller {

    async logout(ctx) {
      ctx.logout();

      ctx.body = {
        code: '0',
        msg: '退出登录成功',
        result: {},
      };
      ctx.status = 200;
    }

<<<<<<< HEAD
        async login (ctx) {

            let userInfo = await ctx.model.AuthUser.findOne({
                account: ctx.query.username,
                password: crypto.createHash('md5').update(ctx.query.password).digest('hex'),
            })
=======
    async login(ctx) {
      const [ userInfo ] = await ctx.app.mysql.get('back').select('user', {
        where: {
          account: ctx.query.username,
          password: crypto.createHash('md5').update(ctx.query.password).digest('hex'),
        },
      });
>>>>>>> master

      if (userInfo) {
        ctx.login({
          username: ctx.query.username,
          password: ctx.query.password,
        });

<<<<<<< HEAD
                ctx.body = {
                    "code": "0",
                    "msg": "登录成功",
                    "result": {
                        id: userInfo._id,
                        userName: userInfo.name,
                    }
                }
                ctx.status = 200;
            } else {
                ctx.body = {
                    "code": '1',
                    "msg": "账号或密码错误",
                    "result": {}
                }
                ctx.status = 200;
            }
        }
=======
        ctx.body = {
          code: '0',
          msg: '登录成功',
          result: {
            id: userInfo.id,
            userName: userInfo.name,
          },
        };
        ctx.status = 200;
      } else {
        ctx.body = {
          code: '1',
          msg: '账号或密码错误',
          result: {},
        };
        ctx.status = 200;
      }
>>>>>>> master
    }
  }
  return sysController;
};
