/**
 * 商品
*/
const { addAPIConfig } = require('../utils/config.js');
const {getRequest,postRequest}=require('../utils/request.js');

addAPIConfig('GOODSLIST','/goods/m/getlist');// 增加接口映射

const getListByCatalogId = (data) => {
  return postRequest('GOODSLIST', data);
};



module.exports={
  getListByCatalogId
}