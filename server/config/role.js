'use strict';

module.exports = function(app) {
  app.role.failureHandler = function(action,ctx) {
    // this.body = {
    //   code: this.helper.errorCode.PERMISSION,
    //   msg: 'sorry，该用户无权限访问',
    //   result: {
    //     userId: this.session.userInfo,
    //     uri: action,
    //   },
    // };
  };

  app.role.use(function*(action) {

    if (!this.session.userInfo) {
      if (this.acceptJSON) {
        this.body = {
          code: this.helper.errorCode.NOTLOGIN,
          msg: '账号未登录',
          result: {
            userId: this.session.userInfo,
            uri: action,
          },
        };
      } else {
        this.redirect('/login?redirect=' + encodeURIComponent(this.originalUrl));
      }

      return false;
    }

    const result = yield this.app.mysql.get('back').query('select distinct bm.* from back_role_module rm left join back_module bm on rm.module_id=bm.id left join back_user_role ur on rm.role_id=ur.role_id WHERE ur.user_id=? AND bm.module_uri=?', [ this.session.userInfo.id, action ]);

    this.logger.info('permission:', {
      userId: this.session.userInfo.id,
      action,
    }, '=> ' + !!result.length);

    return !!result.length;
  });
};
