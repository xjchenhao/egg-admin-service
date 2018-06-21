'use strict';

const crypto = require('crypto');

module.exports = app => {
  class userService extends app.Service {

    async index(pageNumber = 1, pageSize = 20, query) {

      return this.ctx.response.format.paging({
        resultList: await this.ctx.model.AuthUser.find(query)
          .skip((pageNumber - 1) * pageSize)
          .limit(Number(pageSize))
          .exec(),

        totalLength: await this.ctx.model.AuthUser.find(query).count(),
        pageSize,
        currentPage: Number(pageNumber),
      });
    }

    async create(data) {
      const result = await this.ctx.model.AuthUser.create(Object.assign(data, {
        password: crypto.createHash('md5').update(data.password).digest('hex'),
      }));

      return result;
    }

    async destroy(id) {
      const result = await this.ctx.model.AuthUser.remove({
        _id: id,
      });

      // 删除用户组集合中与此用户相关的数据
      this.ctx.model.AuthGroup.update({},
        {
          $pull: { users: id },
        }
      );

      return result.result.n !== 0 && result;

    }

    async edit(id) {
      const result = await this.ctx.model.AuthUser.findOne({
        _id: id,
      });

      return result;
    }

    async update(id, data) {
      let newData = Object.assign(data, { _id: id });

      if (data.password) {
        newData = Object.assign(newData, {
          password: crypto.createHash('md5').update(data.password).digest('hex'),
        });
      }

      try {
        return await this.ctx.model.AuthUser.findByIdAndUpdate(id, newData, {
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

