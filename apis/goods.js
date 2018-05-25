/**
 * 商品
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('GOODS_LIST', '/goods/m/getlist');// 商品列表
addAPIConfig('MONTH_HOT', '/goods/m/getmonthpopularlist');// 增加接口映射
addAPIConfig('INDEX_BANNER', '/goods/m/getcate');
addAPIConfig('INDEX_RECOMMEND', '/goods/m/getindexlist');
addAPIConfig('SHOP_HANDLEPICKED', '/goods/m/getmychoices');
addAPIConfig('NEW_GOODS_LIST', '/goods/m/getnewgoodslist');
addAPIConfig('HOT_SEARCH', '/goods/m/gethotsearch');
addAPIConfig('HOT_SALE_LIST', '/goods/m/gethotsalelist');
addAPIConfig('GOODS_LIST_BY_BRAND', '/goods/m/getgoodslistbyid');
addAPIConfig('SEARCH', '/goods/m/search');
// provinceid与cityid默认为0
// 品牌商品
const getGoodsByBrand = (data) => {
  return postRequest('GOODS_LIST_BY_BRAND', data);
}
// 单品热销榜
const getHotSaleList = (provinceid = 0, cityid = 0) => {
  return getRequest('HOT_SALE_LIST', {
    provinceid,
    cityid
  });
}
// 获取本月爆款
const getMonthPopularList = (provinceid = 0, cityid = 0) => {
  return getRequest('MONTH_HOT', {
    provinceid,
    cityid
  });
}
// 获取首页滑动banner
const getBanner = (type = 0) => {
  return getRequest('INDEX_BANNER', {
    type
  });
}
// 首页推荐版块
const getIndexRecommend = (provinceid = 0, cityid = 0) => {
  return getRequest('INDEX_RECOMMEND', {
    provinceid,
    cityid
  });
}
// 店主精选
const getShopHandpicked = (actiontype = 0) => {
  return getRequest('SHOP_HANDLEPICKED', {
    actiontype
  });
}
// 新品推荐
const getNewGoodsList = (provinceid = 0, cityid = 0, pagesize = 10, pageindex = 1, lowerprice = 0, upperprice = 0, orderfield = 5, orderform = 2) => {
  return postRequest('NEW_GOODS_LIST', {
    provinceid,
    cityid,
    orderfield,
    orderform,
    pagesize,
    pageindex,
    lowerprice,
    upperprice
  });
}
// 热门搜索
const gethotsearch = () => {
  return getRequest('HOT_SEARCH');
}
// 商品列表
const getGoodList = ({
    cateid = -1,
  pagesize = 10,
  pageindex = 1,
  lowerprice = 0,
  upperprice = 0,
  orderfield = 5,
  orderform = 2,
  sortid = '7699'
}, autoShowLoading = true) => {
  return postRequest({
    name: 'GOODS_LIST',
    data: {
      cateid,
      pagesize,
      pageindex,
      lowerprice,
      upperprice,
      orderfield,
      orderform,
      sortid
    },
    autoShowLoading // 自动加载中
  });
}
// 搜索结果
const getSearchList = (pagesize = 10, pageindex = 1, lowerprice = 0, upperprice = 0, orderfield, orderform, search) => {
  return postRequest('SEARCH', {
    orderfield,
    orderform,
    pagesize,
    pageindex,
    lowerprice,
    upperprice,
    search
  });
}


module.exports = {
  getMonthPopularList,
  getBanner,
  getIndexRecommend,
  getShopHandpicked,
  getIndexRecommend,
  getNewGoodsList,
  gethotsearch,
  getGoodList,
  getHotSaleList,
  getGoodsByBrand,
  getSearchList
}