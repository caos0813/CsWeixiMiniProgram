/**
 * 分类
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('GOODS_CATALOG', '/goods/m/getcate');// 增加接口映射

// 分类目录
const getCatalogue = (type = 0) =>{
  return getRequest({
    name:'GOODS_CATALOG',
    data:{
      type
    }
  })
}

module.exports = {
  getCatalogue
}