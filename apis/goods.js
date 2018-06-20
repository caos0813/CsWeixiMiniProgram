/**
 * 商品
 */
const {
  addAPIConfig
} = require('../utils/config.js');
const {
  getRequest,
  postRequest
} = require('../utils/request.js');

addAPIConfig('GOODS_LIST', '/goods/m/getlist'); // 商品列表
addAPIConfig('MONTH_HOT', '/goods/m/getmonthpopularlist'); // 增加接口映射
addAPIConfig('INDEX_BANNER', '/goods/m/getcate');
addAPIConfig('INDEX_RECOMMEND', '/goods/m/getindexlist');
addAPIConfig('SHOP_HANDLEPICKED', '/goods/m/getmychoices');
addAPIConfig('NEW_GOODS_LIST', '/goods/m/getnewgoodslist');
addAPIConfig('HOT_SEARCH', '/goods/m/gethotsearch');
addAPIConfig('HOT_SALE_LIST', '/goods/m/gethotsalelist');
addAPIConfig('GOODS_LIST_BY_BRAND', '/goods/m/getgoodslistbyid');
addAPIConfig('SEARCH', '/goods/m/search');
addAPIConfig('HOTGOODSLIST','/goods/m/gethotgoodslist');// 单品火爆
addAPIConfig('GOODS_DETAIL','/goodsdetail/m/getdetail');// 商品详情
addAPIConfig('GOODS_SKUDETAIL','/goodsdetail/m/getsku');// 商品SKU
addAPIConfig('GOODS_COMMENT','/goodsdetail/m/comment');// 商品评论
addAPIConfig('BUY_GOODS','/cart/m/buy');// 购买商品

addAPIConfig('SMALL_BANNER', '/goods/m/small/banner');// 单品热销榜 banner

// provinceid与cityid默认为0
// 品牌商品
// const getGoodsByBrand = (data) => {
//   return postRequest('GOODS_LIST_BY_BRAND', data);
// }
const getGoodsByBrand = ({
  orderfield = 4, // 1.价格排序 2.收益排序 3.销量排序 4.综合排序 5.新品优先
  orderform = 0, // 1.升序 2.降序 
  lowerprice = 0,
  upperprice = 0,
  provinceid = 0,
  cityid = 0,
  brandid = 0,
  pagesize = 10,
  pageindex = 1
}, autoShowLoading = true) => {
  return postRequest({
    name: 'GOODS_LIST_BY_BRAND',
    data: {
      orderfield,
      orderform,
      lowerprice,
      upperprice,
      provinceid,
      cityid,
      brandid,
      pagesize,
      pageindex
    },
    autoShowLoading // 自动加载中
  });
}
// 单品热销榜
const getHotSaleList = (provinceid = 0, cityid = 0) => {
  return getRequest('HOT_SALE_LIST', {
    provinceid,
    cityid
  });
}
// 10精品推荐 11新品推荐 12火爆单品 13 热销榜 14 本月爆款 15 猜你喜欢
const getSmallBanner = (topicid = 12) => {
  return getRequest('SMALL_BANNER', {
    topicid
  })
}
// 获取本月爆款
const getMonthPopularList = (provinceid = 0, cityid = 0) => {
  return getRequest('MONTH_HOT', {
    provinceid,
    cityid
  });
}
// 获取首页滑动banner
const getBanner = ({
  type = 0
}, autoShowLoading = true) => {
  return getRequest({
    name: 'INDEX_BANNER',
    data: {
      type
    },
    autoShowLoading
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
const getNewGoodsList = ({
  provinceid = 0,
  cityid = 0,
  pagesize = 10,
  pageindex = 1,
  lowerprice = 0,
  upperprice = 0,
  orderfield,
  orderform
}, autoShowLoading = true) => {
  return postRequest({
    name: 'NEW_GOODS_LIST',
    data: {
      provinceid,
      cityid,
      orderfield,
      orderform,
      pagesize,
      pageindex,
      lowerprice,
      upperprice
    },
    autoShowLoading // 自动加载中);
  })
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
  sortid = ''
}, autoShowLoading = true) => {
  return postRequest({
    name:'GOODS_LIST',
    data:{
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
const getSearchList = ({
  pagesize = 10,
  pageindex = 1,
  lowerprice = 0,
  upperprice = 0,
  orderfield,
  orderform,
  search
}, autoShowLoading = true) => {
  return postRequest('SEARCH', {
    orderfield,
    orderform,
    pageindex,
    pagesize,
    lowerprice,
    upperprice,
    search
  });
}
// 火爆单品
const getHotGoodsList = ({
  orderfield = 5,//排序字段 1.价格排序 2.收益排序 3.销量排序 4.综合排序 5.新品优先 ,
  orderform = 2,//排序形式 1.升序 2.降序 ,
  lowerprice = 0,//价格区间下限 
  upperprice = 0,//价格区间上限 
  lowerincome= 0,//收益区间下限 
  upperincome= 0, // 收益区间上限 
  pageindex= 1,
  pagesize= 10
}, autoShowLoading=true)=>{
  return postRequest({
    name:'HOTGOODSLIST',
    data:{
      orderfield,
      orderform,
      lowerprice,
      upperprice,
      lowerincome,
      upperincome,
      pageindex,
      pagesize
    },
    autoShowLoading
  })
}

const getGoodsDetail = ({
  spuid=-1,
  autoShowLoading=true,
  isCustomError=true
})=>{
  return getRequest({
    name: 'GOODS_DETAIL',
    data: {
      spuid
    },
    isCustomError,
    autoShowLoading // 自动加载中
  })
}
const getGoodsSKUDetail = ({
  spuid = -1,
  autoShowLoading = true,
  isCustomError = true
}) => {
  return getRequest({
    name: 'GOODS_SKUDETAIL',
    data: {
      spuid
    },
    isCustomError,
    autoShowLoading // 自动加载中
  })
}
// 商品评论列表
const getGoodsComment=({
  spuid = -1,
  pageindex=1,
  pagesize=10,
  autoShowLoading = true,
  isCustomError = true
})=>{
  return getRequest({
    name: 'GOODS_COMMENT',
    data: {
      spuid,
      pageindex,
      pagesize
    },
    isCustomError,
    autoShowLoading // 自动加载中
  })
}
// 立即购买
const buyGoods = (options, cartItem)=>{
  options.name ='BUY_GOODS'
  return postRequest(options, cartItem);
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
  getSearchList,
  getHotGoodsList,
  getGoodsDetail,
  getGoodsSKUDetail,
  getGoodsComment,
  getSmallBanner,
  buyGoods
}