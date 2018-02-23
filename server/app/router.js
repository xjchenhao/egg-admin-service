'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const passportMiddleware = app.middleware.passportLocal();

  // let passportMiddleware = async function (ctx, next) {
  //   let { req, res } = ctx;

  //   await app.passport.authenticate('local', async function (err, user, info) {

  //     if (err) { return next(err); }
  //     // console.log(ctx);
  //     if (!user) {
  //       console.log('登录失败');
  //       console.log(ctx.body);
  //       ctx.body = {
  //         "code": "1000",
  //         "msg": info || "请输入正确的账号或密码",
  //         "result": {}
  //       }
  //       return false;
  //       // ctx.app.router.redirect('/nodeApi/auth/users', 302);
  //       // return await next();

  //     }
  //     await next();

  //     // req.logIn(user, function (err) {
  //     //   if (err) { return next(err); }
  //     //   // ctx.body = {
  //     //   //   "code": "0",
  //     //   //   "msg": "ok",
  //     //   //   "result": {

  //     //   //   }
  //     //   // }
  //     //   // 已登陆
  //     //   return next();
  //     //   // return ctx.res.redirect('/nodeApi/auth/users');
  //     //   // return res.redirect('/users/' + user.username);
  //     // });
  //   })(ctx, next);
  //   // await next();
  // };

  // ------------------------------------------------------------------------------------------------【api路由】

  /* 用户管理 */
  app.get('/nodeApi/auth/users', 'auth.user.index');                      // 用户列表
  app.post('/nodeApi/auth/users', 'auth.user.create');                   // 新建用户
  app.delete('/nodeApi/auth/users/:id', 'auth.user.destroy');           // 删除用户
  app.get('/nodeApi/auth/users/:id/edit', 'auth.user.edit');               // 用户详情
  app.put('/nodeApi/auth/users/:id', 'auth.user.update');                // 修改用户详情
  app.put('/nodeApi/auth/usersPwd/:id', 'auth.user.setPassword');   // 重置密码

  /*用户组管理*/
  app.get('/nodeApi/auth/groups', 'auth.group.index');                         // 用户组列表
  app.post('/nodeApi/auth/groups', 'auth.group.create');                      // 添加用户组
  app.delete('/nodeApi/auth/groups/:id', 'auth.group.destroy');              // 删除用户组
  app.get('/nodeApi/auth/groups/:id/edit', 'auth.group.edit');                  // 用户组详情
  app.put('/nodeApi/auth/groups/:id', 'auth.group.update');                   // 修改用户组详情
  app.get('/nodeApi/auth/groupUsers/:id', 'auth.group.getUser');             // 成员查看
  app.put('/nodeApi/auth/groupUsers/:id', 'auth.group.setUser');             // 成员设置
  app.get('/nodeApi/auth/groupModules/:id', 'auth.group.getModule');       // 权限查看
  app.put('/nodeApi/auth/groupModules/:id', 'auth.group.setModule');       // 权限设置

  /*模块管理*/
  app.get('/nodeApi/auth/modules', 'auth.module.index');                // 模块列表
  app.post('/nodeApi/auth/modules', 'auth.module.create');             // 添加模块
  app.delete('/nodeApi/auth/modules/:id', 'auth.module.destroy');     // 删除模块
  app.get('/nodeApi/auth/modules/:id/edit', 'auth.module.edit');         // 模块详情
  app.put('/nodeApi/auth/modules/:id', 'auth.module.update');          // 修改模块详情
  app.get('/nodeApi/auth/modules/system', 'auth.module.system');       // 系统级模块列表

  /* 系统级接口 */
  app.get('sysLogout', '/nodeApi/sys/logout', 'sys.main.logout');           // 登录接口
  app.get('sysLogin', '/nodeApi/sys/login', 'sys.main.login');              // 登录接口
  app.get('sysUserInfo', '/nodeApi/sys/userInfo', 'sys.main.userInfo');     // 获取用户信息
  app.get('sysSidebar', '/nodeApi/sys/sidebar', 'sys.main.sidebar');        // 查看系统菜单

  app.get('/nodeApi/sys/editProfile/:id/edit', 'sys.editProfile.edit');           // 编辑资料-用户详情
  app.put('/nodeApi/sys/editProfile/:id', 'sys.editProfile.update');              // 编辑资料-修改用户详情
  app.put('/nodeApi/sys/editProfile/pwd/:id', 'sys.editProfile.setPassword');     // 编辑资料-重置密码


  /* passport测试 */
  // app.post('/nodeApi/passport/login', app.passport.authenticate('local', {              // 登录接口
  //   successRedirect: '/nodeApi/passport/success',
  //   failureRedirect: '/nodeApi/passport/failure'
  // }));
  // app.get('/nodeApi/passport/success', );
  app.post('/nodeApi/sys/aaa', passportMiddleware);
};
