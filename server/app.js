const LocalStrategy = require('passport-local').Strategy;

const crypto = require('crypto');

module.exports = app => {
    // 挂载 strategy
    app.passport.use('local', new LocalStrategy({
        passReqToCallback: true,
    }, (req, username, password, done) => {

        // format user
        const user = {
            provider: 'local',
            username,
            password,
        };
        
        app.passport.doVerify(req, user, done);
    }));

    // 处理用户信息
    app.passport.verify(async (ctx, user) => {
        let list = await ctx.app.mysql.get('back').select('back_user', {
            where: {
                user_account: user.username,
                user_password: crypto.createHash('md5').update(user.password).digest('hex'),
            },
        });

        if (list.length) {
            return user;
        }
    });
    app.passport.serializeUser(async (ctx, user) => { });
    app.passport.deserializeUser(async (ctx, user) => { });
};
