'use strict';

module.exports = app => {
  class userService extends app.Service {

    async index(pageNumber = 1, pageSize = 20, query) {
      pageNumber = Number(pageNumber);
      pageSize = Number(pageSize);

      return this.ctx.response.format.paging({
        resultList: await this.ctx.model.AuthGroup.find(query)
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .exec(),

        totalLength: await this.ctx.model.AuthGroup.find(query).count(),
        pageSize,
        currentPage: Number(pageNumber),
      });
    }

    async create(data) {

      const result = await this.ctx.model.AuthGroup.create(data);

      return result;
    }

    async destroy(id) {
      // const conn = await app.mysql.get('back').beginTransaction(); // 初始化事务
      // try {
      //   await this.app.mysql.get('back').delete('role', { id });
      //   await this.app.mysql.get('back').delete('module', { id });
      //   await this.app.mysql.get('back').delete('user_role', { id });

      //   await conn.commit(); // 提交事务
      // } catch (err) {
      //   // error, rollback
      //   await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      //   throw err;
      // }

      const result = await this.ctx.model.AuthGroup.remove({
        _id: id,
      });

      return result.result.n !== 0 && result;
    }

    async edit(id) {
      const result = await this.ctx.model.AuthGroup.findOne({
        _id: id,
      });

      return result;
    }

    async update(id, data) {
      const newData = Object.assign(data, { _id: id });

      try {
        return await this.ctx.model.AuthGroup.findByIdAndUpdate(id, newData, {
          new: true,
          runValidators: true,
        }).exec();
      } catch (err) {
        this.ctx.logger.error(err.message);
        return '';
      }
    }
  }
  return userService;
};

