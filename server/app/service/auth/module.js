'use strict';


module.exports = app => {
  class moduleService extends app.Service {

<<<<<<< HEAD
        async index (pageNumber = 1, pageSize = 20, query) {
=======
    * index(pageNumber = 1, pageSize = 10, query) {
>>>>>>> master

            const result = await this.ctx.model.AuthModule.find(query);

<<<<<<< HEAD
            return this.ctx.response.format.paging({
                resultList: await this.ctx.model.AuthModule.find(query)
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .exec(),

                totalLength: await this.ctx.model.AuthModule.find(query).count(),
                pageSize,
                currentPage: Number(pageNumber),
            });
        }

        async create (data) {
            const result = this.ctx.model.AuthModule.create(data);
=======
      let where = '';

      for (const key in query) {
        if (where) {
          where += ' AND ';
        }
        where += 'b.' + key;
        where += '=';
        where += '"' + query[key] + '"';
      }

      let result = [];
      let totalCount = [];

      if (where) {
        result = yield this.app.mysql.get('back').query(`select b.*,a.name as parent_name from module b inner join (select id,name from module) a on b.parent_id=a.id WHERE ${where} ORDER BY b.update_date DESC LIMIT ${(pageNumber - 1) * pageSize}, ${Number(pageSize)};`);

        totalCount = yield this.app.mysql.get('back').query(`select b.*,a.name as parent_name from module b inner join (select id,name from module) a on b.parent_id=a.id WHERE ${where} ORDER BY b.update_date DESC LIMIT ${(pageNumber - 1) * pageSize}, ${Number(pageSize)};`);
      } else {
        result = yield this.app.mysql.get('back').query(`SELECT * FROM module ORDER BY update_date DESC LIMIT ${(pageNumber - 1) * pageSize}, ${Number(pageSize)};`);

        totalCount = yield this.app.mysql.get('back').query('SELECT * FROM module');
      }
      return this.ctx.response.format.paging({
        totalList: totalCount,
        resultList: result,
        pageSize,
        currentPage: Number(pageNumber),
      });
    }

    * create(data) {

      const result = yield this.app.mysql.get('back').insert('module', data);

      return result;
    }

    * destroy(id) {
      const conn = yield app.mysql.get('back').beginTransaction(); // 初始化事务
      try {
        yield this.app.mysql.get('back').delete('module', { id });
        yield this.app.mysql.get('back').delete('role_module', { id });

        yield conn.commit(); // 提交事务
      } catch (err) {
        // error, rollback
        yield conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }
    }

    * edit(id) {
      const result = yield this.app.mysql.get('back').get('module', {
        id,
      });
>>>>>>> master

      return result;
    }

<<<<<<< HEAD
        async destroy (id) {
            const result = await this.ctx.model.AuthModule.remove({
                _id: id,
            });

            return result.result.n !== 0 && result;
        }

        async edit (id) {
            const result = await this.ctx.model.AuthModule.findOne({
                _id: id,
            });
=======
    * update(id, data) {
      const result = yield this.app.mysql.get('back').update('module', Object.assign(data, { id }));

      return result;
    }
>>>>>>> master

    * system(opts) {
      const isAll = opts.filterHide;
      const id = opts.parentId;

      let originalObj = null;

      if (isAll) {
        originalObj = yield this.app.mysql.get('back').select('module', {
          where: {
            show: 1,
          },
        });
      } else {
        originalObj = yield this.app.mysql.get('back').select('module');
      }

      const subset = function(parentId) { // 根据父级id遍历子集
        const arr = [];

        // 查询该id下的所有子集
        originalObj.forEach(function(obj) {
          if (obj.parent_id === parentId) {
            arr.push(Object.assign(obj, {
              children: subset(obj.id),
            }));
          }
        });

        // 如果没有子集 直接退出
        if (arr.length === 0) {
          return [];
        }

<<<<<<< HEAD
        async update (id, data) {

            try {
                return await this.ctx.model.AuthModule.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                }).exec();
            } catch (err) {
                this.ctx.logger.error(err.message);
                return '';
            }
        }

        async system (opts) {
            const isAll = !opts.filterHide;
            const id = opts.parentId;

            let originalObj = null;

            if (isAll) {
                originalObj = await this.ctx.model.AuthModule.find({}, {
                    name: 1,
                    show: 1,
                    sort: 1,
                    parent_id: 1,
                });
            } else {
                originalObj = await this.ctx.model.AuthModule.find({
                    show: 1
                });
            }
            
            // this.ctx.logger.debug(originalObj);

            let aaaa = 1;
            const subset = function (parentId) {    // 根据父级id遍历子集
                let arr = [];

                // 查询该id下的所有子集
                originalObj.forEach(function (obj) {
                    if ((obj.parent_id ? obj.parent_id.toString() : obj.parent_id) === parentId) {
                        arr.push(Object.assign(obj.toJSON(), {
                            children: subset(obj.id.toString()),
                        }));
                    }
                });

                // 如果没有子集 直接退出
                if (arr.length === 0) {
                    return [];
                }

                // 对子集进行排序
                arr.sort(function (val1, val2) {
                    if (val1.sort < val2.sort) {
                        return -1;
                    } else if (val1.sort > val2.sort) {
                        return 1;
                    }
                    return 0;

                });

                return arr;
            };

            return subset(id || undefined);
        }
=======
        // 对子集进行排序
        arr.sort(function(val1, val2) {
          if (val1.sort < val2.sort) {
            return -1;
          } else if (val1.sort > val2.sort) {
            return 1;
          }
          return 0;

        });

        return arr;
      };

      return subset(Number(id) || 0);
>>>>>>> master
    }
  }
  return moduleService;
};

