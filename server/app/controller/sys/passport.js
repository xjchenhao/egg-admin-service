'use strict';

const crypto = require('crypto');
let _ = require('underscore');

module.exports = app => {
    class sysController extends app.Controller {

        * success (ctx) {

            ctx.body = {
                "code": "0",
                "msg": "登录成功",
                "result": {}
            }
            
            return false;
        }

        * failure (ctx) {

            ctx.body = {
                "code": '1',
                "msg": "账号或密码错误",
                "result": {}
            }

            return false;
        }
    }
    return sysController;
};