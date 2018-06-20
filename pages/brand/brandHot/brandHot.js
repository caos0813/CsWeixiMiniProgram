// pages/brandHot/brandHot.js  品牌热销榜
const { getHotBrandList } = require('../../../apis/brands.js');
const wxAPI = require('../../../utils/wx-api.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandsArr: [],
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wxAPI.showLoading({
      title: '加载中...',
    });
    getHotBrandList().then(res => {
      this.setData({
        brandsArr: this.data.brandsArr.concat(res),
        isLoading: true
      });
      wxAPI.hideLoading();
      if (res.code !== 1) {

      }
    }, () => {
      console.log('fail');
    });
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