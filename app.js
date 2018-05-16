//app.js
/**
 * getApp()
全局的 getApp() 函数可以用来获取到小程序实例。

// other.js
var appInstance = getApp()
console.log(appInstance.globalData) // I am global data
注意：

App() 必须在 app.js 中注册，且不能注册多个。
不要在定义于 App() 内的函数中调用 getApp() ，使用 this 就可以拿到 app 实例。
不要在 onLaunch 的时候调用 getCurrentPages()，此时 page 还没有生成。
通过 getApp() 获取实例之后，不要私自调用生命周期函数。
 * 
 * onLaunch, onShow 参数
字段	类型	说明
path	String	打开小程序的路径
query	Object	打开小程序的query
scene	Number	打开小程序的场景值
shareTicket	String	shareTicket，详见 获取更多转发信息
referrerInfo	Object	当场景为由从另一个小程序或公众号或App打开时，返回此字段
referrerInfo.appId	String	来源小程序或公众号或App的 appId，详见下方说明
referrerInfo.extraData	Object	来源小程序传过来的数据，scene=1037或1038时支持
场景值 详见。

以下场景支持返回 referrerInfo.appId：

场景值	场景	appId 信息含义
1020	公众号 profile 页相关小程序列表	返回来源公众号 appId
1035	公众号自定义菜单	返回来源公众号 appId
1036	App 分享消息卡片	返回来源应用 appId
1037	小程序打开小程序	返回来源小程序 appId
1038	从另一个小程序返回	返回来源小程序 appId
1043	公众号模板消息	返回来源公众号 appId
 * 
 * onPageNotFound
基础库 1.9.90 开始支持，低版本需做兼容处理

当要打开的页面并不存在时，会回调这个监听器，并带上以下信息：

字段	类型	说明
path	String	不存在页面的路径
query	Object	打开不存在页面的 query
isEntryPage	Boolean	是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面）
开发者可以在 onPageNotFound 回调中进行重定向处理，但必须在回调中同步处理，异步处理（例如 setTimeout 异步执行）无效。



*/
App({
  //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo

          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
        }
      }
    })
  },
  //	Function	生命周期函数--监听小程序显示	当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow(){},
  //Function	生命周期函数--监听小程序隐藏	当小程序从前台进入后台，会触发 onHide
  onHide(){},	
  //Function	错误监听函数	当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
 onError(){},	
 //Function	页面不存在监听函数	当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数，详见下文
 onPageNotFound(){}, 	
  //其他	Any		开发者可以添加任意的函数或数据到 Object 参数中，用 this 可以访问
  globalData: {
    userInfo: null
  }
})