'use strict';

const crypto = require('crypto');

module.exports = app => {
  class userService extends app.Service {

    async index (pageNumber = 1, pageSize = 20, query) {

<<<<<<< HEAD
      const result = await this.ctx.model.AuthUser.find(query);

      return this.ctx.response.format.paging({
        resultList: await this.ctx.model.AuthUser.find(query)
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .exec(),
=======
      const result = yield this.app.mysql.get('back').select('user', {
        where: query,
        limit: Number(pageSize), // 返回数据量
        offset: (pageNumber - 1) * pageSize, // 数据偏移量
        orders: [[ 'update_date', 'desc' ]], // 排序方式
      });

      const totalCount = yield this.app.mysql.get('back').count('user', query);
>>>>>>> master

        totalLength: await this.ctx.model.AuthUser.find(query).count(),
        pageSize,
        currentPage: Number(pageNumber),
      });
    }

<<<<<<< HEAD
    async create (data) {
      const result =await this.ctx.model.AuthUser.create(Object.assign(data, {
        password: crypto.createHash('md5').update(data.password).digest('hex')
      }))
=======
    * create(data) {

      /*eslint-disable */
      const result = yield this.app.mysql.get('back').insert('user', Object.assign(data, {
        user_password: crypto.createHash('md5').update(data.user_password).digest('hex')
      }));
      /* eslint-enable */
>>>>>>> master

      return result;
    }

<<<<<<< HEAD
    async destroy (id) {
      const result = await this.ctx.model.AuthUser.remove({
        _id: id,
      });
=======
    * destroy(id) {
      const conn = yield app.mysql.get('back').beginTransaction(); // 初始化事务
      try {
        yield this.app.mysql.get('back').delete('user', { id });
        yield this.app.mysql.get('back').delete('user_role', { user_id: id });
>>>>>>> master

      return result.result.n !== 0 && result;

    }

<<<<<<< HEAD
    async edit (id) {
      const result = await this.ctx.model.AuthUser.findOne({
        _id: id,
=======
    * edit(id) {
      const result = yield this.app.mysql.get('back').get('user', {
        id,
>>>>>>> master
      });

      return result;
    }

    async update (id, data) {
      let newData = Object.assign(data, { _id: id });

      if (data.password) {
        newData = Object.assign(newData, {
          password: crypto.createHash('md5').update(data.password).digest('hex'),
        });
      }

<<<<<<< HEAD
      try {
        return await this.ctx.model.AuthUser.findByIdAndUpdate(id, newData, {
          new: true,
          runValidators: true,
        }).exec();
      } catch (err) {
        this.ctx.logger.error(err.message);
        return '';
      }
=======
      const result = yield this.app.mysql.get('back').update('user', newData);

      return result;
>>>>>>> master
    }
  }
  return userService;
};

