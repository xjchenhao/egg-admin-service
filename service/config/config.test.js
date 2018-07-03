'use strict';

module.exports = appInfo => {
  const config = exports = {
    security: {
      csrf: {
        enable: false,
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

  return config;
};
