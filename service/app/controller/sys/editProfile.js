'use strict';
const _ = require('underscore');

const Controller = require('./../../core/baseController');

class sysEditProfileController extends Controller {

  * edit(ctx) {
    const query = ctx.params;

    const result = yield ctx.service.auth.user.edit(query.id);

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

  * update(ctx) {
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
      this.failure({
        data: err.errors,
        state: 400,
      });

      return;
    }

    const result = yield ctx.service.auth.user.update(id, _.pick(query, 'mobile', 'email'));

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

  * setPassword(ctx) {
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

      this.failure({
        data: err.errors,
        state: 400,
      });

      return;
    }

    const result = yield ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

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
}
module.exports = sysEditProfileController;
