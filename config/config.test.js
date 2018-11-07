'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {
    security: {
      csrf: {
        enable: false,
        disableConsoleAfterReady: false, // ps：egg官方不建议关闭
      },
    },
    logger: {
      level: 'DEBUG',
      consoleLevel: 'DEBUG',
      dir: '/usr/local/logs',
    },
    mongoose: {
      clients: {
        back: {
          url: process.env.EGG_MONGODB_URL || 'mongodb://mongodb/eas',
          options: {},
        },
      },
    },
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
