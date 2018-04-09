'use strict';

module.exports = {
    // 不做csrf校验
    security: {
        csrf: {
            enable: false,
        },
    },

    logger: {
        consoleLevel: 'DEBUG',
    },

    // mysql: {
    //     clients: {
    //         back: {
    //             // host
    //             host: '127.0.0.1',
    //             // 端口号
    //             port: '3306',
    //             // 用户名
    //             user: 'root',
    //             // 密码
    //             password: '123123aa',
    //             // 数据库名
    //             database: 'admin_demo',
    //         },
    //     },
    //     // 是否加载到 app 上，默认开启
    //     app: true,
    //     // 是否加载到 agent 上，默认关闭
    //     agent: false,
    // },

    mongoose: {
        clients: {
            back: {
                url: 'mongodb://127.0.0.1/eas-back',
                options: {},
            }
        },
    },
};
