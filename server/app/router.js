'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  const can = app.middleware.role;

  // ------------------------------------------------------------------------------------------------【api路由】

  /* 用户管理 */
  app.get('aaa','/nodeApi/auth/users', can('auth.user.index'), 'auth.user.index');                      // 用户列表
  app.post('aaa','/nodeApi/auth/users', can('auth.user.create'), 'auth.user.create');                   // 新建用户
  app.delete('/nodeApi/auth/users/:id', can('auth.user.destroy'), 'auth.user.destroy');           // 删除用户
  app.get('/nodeApi/auth/users/:id/edit', can('auth.user.edit'), 'auth.user.edit');               // 用户详情
  app.put('/nodeApi/auth/users/:id', can('auth.user.update'), 'auth.user.update');                // 修改用户详情
  app.put('/nodeApi/auth/usersPwd/:id', can('auth.user.setPassword'), 'auth.user.setPassword');   // 重置密码

  /*用户组管理*/
  app.get('/nodeApi/auth/groups', can('auth.group.index'), 'auth.group.index');                         // 用户组列表
  app.post('/nodeApi/auth/groups', can('auth.group.create'), 'auth.group.create');                      // 添加用户组
  app.delete('/nodeApi/auth/groups/:id', can('auth.group.destroy'), 'auth.group.destroy');              // 删除用户组
  app.get('/nodeApi/auth/groups/:id/edit', can('auth.group.edit'), 'auth.group.edit');                  // 用户组详情
  app.put('/nodeApi/auth/groups/:id', can('auth.group.update'), 'auth.group.update');                   // 修改用户组详情
  app.get('/nodeApi/auth/groupUsers/:id', can('auth.group.getUser'), 'auth.group.getUser');             // 成员查看
  app.put('/nodeApi/auth/groupUsers/:id', can('auth.group.setUser'), 'auth.group.setUser');             // 成员设置
  app.get('/nodeApi/auth/groupModules/:id', can('auth.group.getModule'), 'auth.group.getModule');       // 权限查看
  app.put('/nodeApi/auth/groupModules/:id', can('auth.group.setModule'), 'auth.group.setModule');       // 权限设置

  /*模块管理*/
  app.get('/nodeApi/auth/modules', can('auth.module.index'), 'auth.module.index');                // 模块列表
  app.post('/nodeApi/auth/modules', can('auth.module.create'), 'auth.module.create');             // 添加模块
  app.delete('/nodeApi/auth/modules/:id', can('auth.module.destroy'), 'auth.module.destroy');     // 删除模块
  app.get('/nodeApi/auth/modules/:id/edit', can('auth.module.edit'), 'auth.module.edit');         // 模块详情
  app.put('/nodeApi/auth/modules/:id', can('auth.module.update'), 'auth.module.update');          // 修改模块详情
  app.get('/nodeApi/auth/modules/system', can('auth.module.system'), 'auth.module.system');       // 系统级模块列表

  /* 系统级接口 */
  app.get('sysUserInfo', '/nodeApi/sys/userInfo', 'sys.main.userInfo');     // 获取用户信息
  app.get('sysSidebar', '/nodeApi/sys/sidebar', 'sys.main.sidebar');        // 查看系统菜单

  app.get('/nodeApi/sys/editProfile/:id/edit', 'sys.editProfile.edit');           // 编辑资料-用户详情
  app.put('/nodeApi/sys/editProfile/:id', 'sys.editProfile.update');              // 编辑资料-修改用户详情
  app.put('/nodeApi/sys/editProfile/pwd/:id', 'sys.editProfile.setPassword');     // 编辑资料-重置密码


  /* passport */
  app.get('/nodeApi/sys/login', app.passport.authenticate('local', {              // 登录
    successRedirect: '/nodeApi/passport/success',
    failureRedirect: '/nodeApi/passport/failure'
  }));
  app.get('sysLogout', '/nodeApi/sys/logout', 'sys.passport.logout');           // 退出登录  
  app.get('/nodeApi/passport/success', 'sys.passport.success');
  app.get('/nodeApi/passport/failure', 'sys.passport.failure');
};
