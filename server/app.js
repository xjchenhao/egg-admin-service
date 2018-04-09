const LocalStrategy = require('passport-local').Strategy;

const crypto = require('crypto');

module.exports = app => {
    // 如果用json返回值的方式使用passport模块，`app.passport.use`以及`app.passport.verify`就用不到。目前就是这个情况。
    // // 挂载 strategy
    // app.passport.use('local', new LocalStrategy({
    //     usernameField: 'username',
    //     passwordField: 'password',
    //     passReqToCallback: true,
    // }, (req, username, password, done) => {

    //     // format user
    //     const user = {
    //         provider: 'local',
    //         username,
    //         password,
    //     };
    //     if (!username) {
    //         return done(null, false, { message: '请输入用户名' });
    //     }
    //     if (!password) {
    //         return done(null, false, { message: '请输入密码' });
    //     }
    //     done(null, user);
    //     app.passport.doVerify(req, user, done);
    // }));

    // // 验证用户信息
    // app.passport.verify(async (ctx, user) => {
        
    //     let userInfo = await ctx.model.AuthUser.findOne({
    //         account: ctx.query.username,
    //         password: crypto.createHash('md5').update(ctx.query.password).digest('hex'),
    //     })
    //     ctx.logger.debug('passport:verify',userInfo);

    //     if (userInfo) {
    //         return userInfo;
    //     } else {
    //         return false;
    //     }
    // });
    app.passport.serializeUser(async (ctx, user) => {
        ctx.logger.debug('passport:serializeUser', user);
        return {
            username: user.username,
            password: crypto.createHash('md5').update(user.password).digest('hex'),
        };
    });
    app.passport.deserializeUser(async (ctx, user) => {
        let userInfo = await ctx.model.AuthUser.findOne({
            account: user.username,
            password: user.password,
        })

        ctx.logger.debug('passport:deserializeUser',userInfo);
        return {
            id: userInfo._id,
            userName: userInfo.name,
        };
    });
};
