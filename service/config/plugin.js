'use strict';

// 本地静态资源(其实不需要配置，默认值就是true)
exports.static = true;

// mysql操作
// exports.mysql = {
//   enable: true,
//   package: 'egg-mysql',
// };

// 模版引擎
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

// 表单验证
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
