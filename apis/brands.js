/**
 * 品牌
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('HOT_BRAND', '/goods/m/gethotbrandlist');// 增加接口映射
addAPIConfig('BRAND_SELECTION', '/goods/m/getchosenbrandlist');

// provinceid与cityid默认为0

// 获取热销品牌
const getHotBrandList = (provinceid = 0, cityid = 0) => {
  return getRequest('HOT_BRAND', {
    provinceid,
    cityid
  });
}
// 获取精选大牌
const getBrandSelectionList = (pageindex, pagesize, provinceid = 0, cityid = 0) => {
  return postRequest('BRAND_SELECTION', {
    pageindex,
    pagesize,
    provinceid,
    cityid
  });
}

module.exports = {
  getHotBrandList,
  getBrandSelectionList
}