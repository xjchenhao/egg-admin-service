'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {
    security: {
      csrf: {
        enable: false,
      },
    },
    logger: {
      consoleLevel: 'DEBUG',
    },
    mongoose: {
      clients: {
        back: {
          url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/eas',
          options: {},
        },
      },
    },
    view: {
      root: path.join(appInfo.baseDir, 'app/assets'),
      mapping: {
        '.html': 'nunjucks',
      },
    },
    static: {
      prefix: '/',
      dir: [ path.join(appInfo.baseDir, 'app/assets'), path.join(appInfo.baseDir, 'app/public') ],
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515465031562_6723';

  config.alinode = {
    appid: '75828',
    secret: '34b2b1673c38f2625bb42f456b5b8cf6d4db01b3',
    error_log: [
      path.join('/usr/local/logs', 'common-error.log'),
      path.join('/usr/local/logs', 'stderr.log'),
    ],
    packages: [
      path.join(appInfo.baseDir, 'package.json'),
    ],
  };

  return config;
};
