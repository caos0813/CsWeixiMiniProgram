// pages/brand/brandGoods/brandGoods.js
const { getGoodsByBrand } = require('../../../apis/goods.js');
const wxAPI = require('../../../utils/wx-api.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      orderfield: 4, // 1.价格排序 2.收益排序 3.销量排序 4.综合排序 5.新品优先
      orderform: 0, // 1.升序 2.降序 
      lowerprice: 0,
      upperprice: 0,
      provinceid: 0,
      cityid: 0,
      brandid: 0,
      pagesize: 10,
      pageindex: 1
    },
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.brandname,
    });
    this.setNextData({
      'params.brandid': options.brandid
    });
    getGoodsByBrand(this.data.params).then(res => {
      console.log(res);
      this.setNextData({
        goodsList: this.data.goodsList.concat(res)
      });
    }, () => {
      console.log('fail')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})