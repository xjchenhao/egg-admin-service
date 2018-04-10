'use strict';

const crypto = require('crypto');

module.exports = app => {
  class userService extends app.Service {

    * index(pageNumber = 1, pageSize = 20, query) {

      const result = yield this.app.mysql.get('back').select('user', {
        where: query,
        limit: Number(pageSize), // 返回数据量
        offset: (pageNumber - 1) * pageSize, // 数据偏移量
        orders: [[ 'update_date', 'desc' ]], // 排序方式
      });

      const totalCount = yield this.app.mysql.get('back').count('user', query);

      return {
        list: result,
        currentPage: Number(pageNumber),
        total: Math.ceil(result.length / pageSize),
        pageSize: totalCount,
      };
    }

    * create(data) {

      /*eslint-disable */
      const result = yield this.app.mysql.get('back').insert('user', Object.assign(data, {
        user_password: crypto.createHash('md5').update(data.user_password).digest('hex')
      }));
      /*eslint-enable */

      return result;
    }

    * destroy(id) {
      const conn = yield app.mysql.get('back').beginTransaction(); // 初始化事务
      try {
        yield this.app.mysql.get('back').delete('user', { id });
        yield this.app.mysql.get('back').delete('user_role', { user_id: id });

        yield conn.commit(); // 提交事务
      } catch (err) {
        // error, rollback
        yield conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }

    }

    * edit(id) {
      const result = yield this.app.mysql.get('back').get('user', {
        id,
      });

      return result;
    }

    * update(id, data) {
      let newData = Object.assign(data, { id });

      if (data.user_password) {
        newData = Object.assign(newData, {
          user_password: crypto.createHash('md5').update(data.user_password).digest('hex'),
        });
      }

      const result = yield this.app.mysql.get('back').update('user', newData);

      return result;
    }
  }
  return userService;
};

