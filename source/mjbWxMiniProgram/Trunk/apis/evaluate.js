/**
 * 评价
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('get_pendingcomment_list', '/goodsdetail/m/getpendingcomment');// 增加接口映射
addAPIConfig('get_comment_list', '/goodsdetail/m/getcommented');
addAPIConfig('commit_comment', '/goodsdetail/m/commitcomment');

// 待评价
const getPendingCommentList = ({
  pagesize = 10,
  pageindex = 1
}, autoShowLoading = true) => {
  return getRequest({
    name: 'get_pendingcomment_list',
    data: {
      pagesize,
      pageindex
    },
    autoShowLoading
  })
}
// 已评价
const getCommentList = ({
  pagesize = 10,
  pageindex = 1
}, autoShowLoading = true) => {
  return getRequest({
    name: 'get_comment_list',
    data: {
      pagesize,
      pageindex
    },
    autoShowLoading
  })
}
// 提交评价
const commit_comment = ({
  pagesize = 10,
  pageindex = 1
}) => {
  return getRequest({
    name: 'commit_comment',
    data: {
      pagesize,
      pageindex
    }
  })
}

module.exports = {
  getPendingCommentList,
  getCommentList,
  commit_comment
}