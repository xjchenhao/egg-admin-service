const LocalStrategy = require('passport-local').Strategy;

module.exports = app => {
    // 挂载 strategy
    app.passport.use(new LocalStrategy({
        passReqToCallback: true,
    }, (req, username, password, done) => {
        console.log(123);
        // format user
        const user = {
            provider: 'local',
            username,
            password,
        };
        debug('%s %s get user: %j', req.method, req.url, user);
        app.passport.doVerify(req, user, done);
    }));


    // 处理用户信息
    app.passport.verify(async (ctx, user) => {
        console.log('verify');
        return true;
    });
    app.passport.serializeUser(async (ctx, user) => {
        // console.log('serializeUser');
        // console.log(user);
        //     ctx.isAuthenticated() = {
        //         id: list[0].id,
        //         name: list[0].user_name,
        //     };


        // ctx.session.userInfo = {
        //     id: list[0].id,
        //     name: list[0].user_name,
        // };

    });
    app.passport.deserializeUser(async (ctx, user) => {
        console.log('deserializeUser');
    });
};
