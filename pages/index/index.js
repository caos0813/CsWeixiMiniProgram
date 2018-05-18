//index.js
//获取应用实例
const app = getApp()
const { getListByCatalogId}=require('../../apis/goods.js')
app.Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow(){
    this.mjd.showToast({title:'ffff'})
  },
  onLoad: function () {


    var pp = getListByCatalogId({
      pageindex: 1,
      pagesize: 10
    });
    pp.then(data=>{

      console.log(data);
    },()=>{

      console.log('fail');
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
