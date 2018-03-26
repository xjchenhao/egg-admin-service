'use strict';

module.exports = {
    format: {
        paging ({ resultList, totalList, pageSize, currentPage }) {
            return {
                list: resultList,
                pages: Number(pageSize),
                currentPage: Number(currentPage),
                total: totalList.length
            };
        }
    }
};
