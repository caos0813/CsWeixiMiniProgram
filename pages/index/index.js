//index.js
//获取应用实例
const app = getApp()
const test= require('../../components/test/test.js')
const { createAnimation}=require('../../utils/wexin-common.js')
Page({
  data: {
    animationData:{},
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
    console.log(wx)
       let animation= createAnimation({
          duration:1400, //	动画持续时间，单位ms
          timingFunction :'linear', //定义动画的效果
          delay :0, //动画延迟时间，单位 ms
          transformOrigin: '50% 50% 0' //设置transform-origin
        });
       animation.rotate(90).translateX(100).step(30);
       this.setData({
         animationData: animation.export()
       })
       setTimeout(function () {
         animation.translate(30).step()
         this.setData({
           animationData: animation.export()
         })
       }.bind(this), 1000)
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  alert(nn)
  {
    console.log('222'+nn);
  }
})
