/**
 * 消息推送
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('PUSH_MSG', '/wx/m/bindminimap');

// 获取热销品牌
const pushMsgId = (data) => {
  return getRequest('PUSH_MSG', data);
}

module.exports = {
  pushMsgId
}