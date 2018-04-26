'use strict';

module.exports = app => {
  class navService extends app.Service {
    * list() {
      return {
        manage: [{
          title: '用户名：[名字全拼],初始密码：123456',
          link: 'http://192.168.2.6:1001',
          projectName: 'git',
          describeCn: 'git服务',
          describeEn: 'code management',
          icon: 'fa fa-git',
        }, {
          title: '用户名：[公司邮箱],初始密码：123456',
          link: 'http://www.leangoo.com/kanban',
          projectName: 'leangoo',
          describeCn: '看板',
          describeEn: 'task Panel',
          icon: 'fa fa-server',
        }, {
          title: '用户名：[xjzx_姓名全拼],密码：自己设置的',
          link: 'http://10.10.0.27:8888',
          projectName: 'Rap api',
          describeCn: 'api管理',
          describeEn: 'api manage',
          icon: 'icon fa fa-paragraph',
        }, {
          title: '用户名：[公司邮箱],初始密码：123456',
          link: 'http://10.10.0.26:8000',
          projectName: 'seafile',
          describeCn: 'ftp服务',
          describeEn: 'ftp server',
          icon: 'fa fa-upload',
        }],
      };
    }
  }
  return navService;
};
