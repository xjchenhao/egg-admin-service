'use strict';

module.exports = {
  format: {
    paging({ resultList, totalLength, pageSize, currentPage }) {
      return {
        list: resultList,
        pages: Number(pageSize),
        currentPage: Number(currentPage),
        total: totalLength,
      };
    },
  },
};
