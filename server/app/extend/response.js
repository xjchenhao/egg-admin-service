'use strict';

module.exports = {
<<<<<<< HEAD
    format: {
        paging ({ resultList, totalLength, pageSize, currentPage }) {
            return {
                list: resultList,
                pages: Number(pageSize),
                currentPage: Number(currentPage),
                total: totalLength
            };
        }
    }
=======
  format: {
    paging({ resultList, totalList, pageSize, currentPage }) {
      return {
        list: resultList,
        pages: Number(pageSize),
        currentPage: Number(currentPage),
        total: totalList.length,
      };
    },
  },
>>>>>>> master
};
