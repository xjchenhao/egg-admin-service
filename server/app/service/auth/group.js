'use strict';

const url = require('url');

module.exports = app => {
  class userService extends app.Service {

    * index(pageNumber = 1, pageSize = 20, query) {

      const result = yield this.app.mysql.get('back').select('back_role', {
        where: query,
        limit: Number(pageSize), // 返回数据量
        offset: (pageNumber - 1) * pageSize, // 数据偏移量
        orders: [[ 'role_addtime', 'desc' ]], // 排序方式
      });

      const totalCount = yield this.app.mysql.get('back').count('back_role', query);

      return {
        list: result,
        currentPage: Number(pageNumber),
        total: Math.ceil(totalCount / pageSize),
        pageSize: totalCount,
      };
    }

    * create(data) {
      const { req } = this.ctx;

      const result = yield this.app.mysql.get('back').insert('back_role', Object.assign(data, {
        role_addip: url.parse(req.url, true).query.ip || req.headers[ 'x-real-ip' ] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress,
      }));

      return result;
    }

    * destroy(id) {
      const conn = yield app.mysql.get('back').beginTransaction(); // 初始化事务
      try {
        yield this.app.mysql.get('back').delete('back_role', { id });
        yield this.app.mysql.get('back').delete('back_role_module', { role_id: id });
        yield this.app.mysql.get('back').delete('back_user_role', { role_id: id });

        yield conn.commit(); // 提交事务
      } catch (err) {
        // error, rollback
        yield conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }
    }

    * edit(id) {
      const result = yield this.app.mysql.get('back').get('back_role', {
        id,
      });

      return result;
    }

    * update(id, data) {
      const result = yield this.app.mysql.get('back').update('back_role', Object.assign(data, { id }));

      return result;
    }
  }
  return userService;
};

