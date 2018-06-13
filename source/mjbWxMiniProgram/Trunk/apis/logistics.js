/**
 * 物流信息
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('get_express_list', '/order/m/express');// 增加接口映射

// 获取物流信息
const getExpressList = ({
  shipmentId = 424,
  expressNo = 71402901028967
}) => {
  return getRequest({
    name: 'get_express_list',
    data: {
      shipmentId,
      expressNo
    }
  })
}

module.exports = {
  getExpressList
}