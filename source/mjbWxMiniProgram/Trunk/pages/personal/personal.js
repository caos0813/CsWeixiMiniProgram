// pages/personal/personal.js
const app = getApp();
const wxAPI = require('../../utils/wx-api.js');
const { getTotal } = require('../../apis/order.js');

app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否微信登录
    isLogin: false,
    // 是否绑定mjd账号
    isBindMjd: false,
    userInfo: {},
    total: {}
  },
  bindGetUserInfo: function(e) {
    console.log(e);
    let self = this;
    if (e.detail.errMsg === 'getUserInfo:ok') {
      this.setData({
        userInfo: e.detail.userInfo,
        isLogin: true
      });
      this.mjd.loginGetAuth(self.getTotal);
    }
  },
  getTotal: function() {
    getTotal().then((res) => {
      this.setData({
        total: res,
        isBindMjd: true
      })
    })
  },
  goPage: function(e) {
    const pageData = {
      'bind': '/pages/bind/bind',
      'order': '/pages/order/list/list?status=0',
      'waitPay': '/pages/order/list/list?status=1',
      'waitDeliver': '/pages/order/list/list?status=10',
      'waitReceive': '/pages/order/list/list?status=20',
      'waitEvaluate': '/pages/evaluate/evaluate',
      'afterSale': '',
      'address': '/pages/address/manager',
      'contact': '',
      'help': '',
      'feedback': ''
    }
    if(!e.currentTarget.dataset.target) {
      return false;
    }
    if(!this.data.isBindMjd) {
      wx.navigateTo({
        url: pageData.bind
      })
    }else {
      wx.navigateTo({
        url: pageData[e.currentTarget.dataset.target]
      })
    }
  },
  // 获取用户头像昵称信息
  getWxInfo: function() {
    let self = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              self.setData({
                userInfo: res.userInfo,
                isLogin: true
              });
              self.getTotal();
            }
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWxInfo();
    if (this.mjd.checkHasToken()) {
      this.setData({
        isBindMjd: true
      })
    }
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