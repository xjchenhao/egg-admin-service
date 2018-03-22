'use strict';


module.exports = app => {
    class moduleService extends app.Service {

        * index(pageNumber = 1, pageSize = 20, query) {


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
                result = yield this.app.mysql.get('back').query(`select b.*,a.module_name as module_parent_name from back_module b inner join (select id,module_name from back_module) a on b.module_parent_id=a.id WHERE ${where} ORDER BY b.update_date DESC LIMIT ${(pageNumber - 1) * pageSize}, ${Number(pageSize)};`);

                totalCount = yield this.app.mysql.get('back').query(`select b.*,a.module_name as module_parent_name from back_module b inner join (select id,module_name from back_module) a on b.module_parent_id=a.id WHERE ${where} ORDER BY b.update_date DESC LIMIT ${(pageNumber - 1) * pageSize}, ${Number(pageSize)};`);
            } else {
                result = yield this.app.mysql.get('back').query(`SELECT * FROM back_module ORDER BY update_date DESC LIMIT ${(pageNumber - 1) * pageSize}, ${Number(pageSize)};`);

                totalCount = yield this.app.mysql.get('back').query(`SELECT * FROM back_module`);
            }

            return {
                list: result,
                currentPage: Number(pageNumber),
                total: Math.ceil(result.length / pageSize),
                pageSize: totalCount.length
            };
        }

        * create(data) {

            const result = yield this.app.mysql.get('back').insert('back_module', data);

            return result;
        }

        * destroy(id) {
            const conn = yield app.mysql.get('back').beginTransaction(); // 初始化事务
            try {
                yield this.app.mysql.get('back').delete('back_module', {id});
                yield this.app.mysql.get('back').delete('back_role_module', {module_id: id});

                yield conn.commit(); // 提交事务
            } catch (err) {
                // error, rollback
                yield conn.rollback(); // 一定记得捕获异常后回滚事务！！
                throw err;
            }
        }

        * edit(id) {
            const result = yield this.app.mysql.get('back').get('back_module', {
                id,
            });

            return result;
        }

        * update(id, data) {
            const result = yield this.app.mysql.get('back').update('back_module', Object.assign(data, {id}));

            return result;
        }

        * system(opts) {
            const isAll = opts.filterHide;
            const id = opts.parentId;

            let originalObj = null;

            if (isAll) {
                originalObj = yield this.app.mysql.get('back').select('back_module', {
                    where: {
                        module_show: 1,
                    },
                });
            } else {
                originalObj = yield this.app.mysql.get('back').select('back_module');
            }

            const subset = function (parentId) {    // 根据父级id遍历子集
                const arr = [];

                // 查询该id下的所有子集
                originalObj.forEach(function (obj) {
                    if (obj.module_parent_id === parentId) {
                        arr.push(Object.assign(obj, {
                            children: subset(obj.id),
                        }));
                    }
                });

                // 如果没有子集 直接退出
                if (arr.length === 0) {
                    return [];
                }

                // 对子集进行排序
                arr.sort(function (val1, val2) {
                    if (val1.module_sort < val2.module_sort) {
                        return -1;
                    } else if (val1.module_sort > val2.module_sort) {
                        return 1;
                    }
                    return 0;

                });

                return arr;
            };

            return subset(Number(id) || 0);
        }
    }
    return moduleService;
};

