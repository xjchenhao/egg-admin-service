'use strict';

const crypto = require('crypto');
const Controller = require('./../../core/baseController');

class sysPassportController extends Controller {

  async logout(ctx) {
    ctx.logout();

    this.success();
  }

  async login(ctx) {

    const userInfo = await ctx.model.AuthUser.findOne({
      account: ctx.query.username,
      password: crypto.createHash('md5').update(ctx.query.password).digest('hex'),
    });

    if (userInfo) {
      ctx.login({
        username: ctx.query.username,
        password: ctx.query.password,
      });

      const groupNameList = await ctx.model.AuthGroup.find({
        users: userInfo.id,
      }, {
        name: 1,
      });

      this.success({
        id: userInfo._id,
        userName: userInfo.name,
        groupList: groupNameList.map(item => item.name),
      });
    } else {


      this.failure({
        code: '1',
        data: {},
        msg: '账号或密码错误',
        state: 200,
      });
    }
  }
}
module.exports = sysPassportController;
