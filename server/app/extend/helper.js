'use strict';

module.exports = {
    /**
     * 产生随机数
     *
     * @param {Number} n - 指定n位数
     * @return {String} see 返回指定长度的字符串
     */
    randomNumber(n) {
        let str = '';

        for (let i = 0; i < n; i++) {
            str += Math.floor(Math.random() * 10);
        }

        return str;
    },
    errorCode: {
        NOTLOGIN: 'notLoginError',
        PERMISSION: 'permissionError',
        CONNECTIONTIMEOUT: 'connectionTimeoutError',
        FORMAT: 'formatError',
        FOUND: 'notFoundError',
    },
};
