//index.js
//获取应用实例
const app = getApp();
const { getBanner, getIndexRecommend, getShopHandpicked } = require('../../apis/goods.js');
const wxAPI = require('../../utils/wx-api.js');

app.Page({
  data: {
    banner: [],
    shopHandPicked: [],
    hotGoods: [],
    rankInfo: [],
    bigBrands: [],
    newProducts: [],
    ad: {},
    showGoTop: false,
    windowHeight: 0
  },
  init: function() {
    this.pageGetBanner();
    this.pageGetRecommend();
    this.pageGetShopHandpicked();
  },
  // 获取banner
  pageGetBanner: function() {
    getBanner().then(res => {
      console.log(res);
      this.setNextData({
        banner: res[0].banner
      })
    }, () => {
      console.log('fail');
    });
  },
  // 获取模块
  pageGetRecommend: function() {
    getIndexRecommend().then(res => {
      console.log(res);
      this.setNextData({
        rankInfo: res.rankinfo,
        bigBrands: res.bigbrands,
        hotGoods: res.hotgoods,
        ad: res.advertinfo,
        newProducts: res.newgoods,
        guessLiked: res.guessyoulike
      });
      wx.stopPullDownRefresh()
    }, () => {
      console.log('fail');
    });
  },
  // 获取精选
  pageGetShopHandpicked: function() {
    getShopHandpicked().then(res => {
      console.log(res);
      this.setNextData({
        shopHandPicked: res.indexchoicesgoods
      });
    }, () => {
      console.log('fail');
    });
  },
  goTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onPullDownRefresh: function() {
    this.init();
  },
  // 热销榜跳转
  goRankNav: function(e) {
    let id = e.currentTarget.dataset.id;
    let pages = {
      '3': '../brand/brandHot/brandHot',
      '14': '../monthHot/monthHot',
      '13': '../goodsTop/goodsTop'
    };
    wx.navigateTo({
      url: pages[id],
    });
  },
  onShow(){
    
  },
  onLoad: function () {
    // 获取屏幕高度
    let self = this;
    wx.getSystemInfo({
      success: function(res) {
        self.setNextData({
          windowHeight: res.windowHeight
        });
      },
    })
    this.init();
    // this.mjd.loginGetAuth();
  },
  onPageScroll: function(e) {
    if(e.scrollTop > this.data.windowHeight) {
      this.setData({
        showGoTop: true
      });
    }else {
      this.setData({
        showGoTop: false
      });
    }
  }
})
