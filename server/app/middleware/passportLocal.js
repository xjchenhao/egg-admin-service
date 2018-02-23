module.exports = () => {
  return async function (ctx, next) {
    let { req, res, app } = ctx;
    // await next();

    await app.passport.authenticate('local', async function (err, user, info) {
      // await next();

      // if (err) { return next(err); }
      // // console.log(this);
      // // console.log(ctx);
      // // console.log(user);
      // // console.log(info);
      // if (!user) {
      //     console.log('登录失败');
      //     this.body = {
      //         "code": "1000",
      //         "msg": info || "请输入正确的账号或密码",
      //         "result": {}
      //     }
      //     // return false;
      //     // ctx.app.router.redirect('/nodeApi/auth/users', 302);
      //     // return await next();

      // }
      // await next();
      // console.log(123);
      ctx.body = {
        "code": "0",
        "msg": "ok",
        "result": {

        }
      }
      return false;

      // req.logIn(user, function (err) {
      //   if (err) { return next(err); }
      //   ctx.body = {
      //     "code": "0",
      //     "msg": "ok",
      //     "result": {

      //     }
      //   }
      //   // 已登陆
      // //   return next();
      //   return ctx.res.redirect('/nodeApi/auth/users');
      //   // return res.redirect('/users/' + user.username);
      // });
    })(ctx, next);
  }
};