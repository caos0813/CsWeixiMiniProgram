/**
 * 满金店公共框架
 * 
*/
const {GLOBALVAR}=require('./config.js')
const util=require('./util.js')

const { getKeys, each, extend, hasOwnProperty, toArray, isArray, resolvePromise} = util




/*******************封装wx常用API-begin*******************************/

/*
注意：目前页面路径最多只能十层。
导航
保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。

url	String	是	需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
success	Function	否	接口调用成功的回调函数
fail	Function	否	接口调用失败的回调函数
complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
*/
var navigateTo = resolvePromise(wx.navigateTo)



/*******************封装wx常用API-end***************************/

/****状态**/

function DataStore(initData)
{

}


/**
 * 启动APP
 * 
*/
function startApp()
{
  let app=App({
    // 全局只执行一次
    onLaunch: function () {
      console.log('onLaunch');
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
                wx.getUserInfo({
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    this.globalData.userInfo = res.userInfo

                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      console.log('app-call');
                      this.userInfoReadyCallback(res)
                    }
                  }
                })
              }
            }
          })
    },
     //当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow()
    {
        console.log('app-show');
    },
    onHide () {
      // Do something when hide.
    },
    // 处理系统错误
    onError (msg) {
     
    },
    // 处理404 页面找不到
    onPageNotFound(){

    },
    // 全局
    GLOBALVAR: GLOBALVAR,
    Page: extendPage,
    globalData: {
      userInfo: null
    }
  });
  
}



function craeteExtendOptions(hook){
  return function extendOption (target, source){
     each(source,(copy,name)=>{
      hook(target[name], copy, name, target, source);
     })
     return target;
  }
}
const extendPageOption = craeteExtendOptions(function(){ 
  function merge(handlers) {
    var handler = function (...args) {
      for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i].apply(this, args)
      }
    }
    handler.handlers = handlers;
    return handler;
  }
  return ( src, copy, name, target, source)=>{    
      if (util.isFunction(src)) {
        target[name] = merge([src, copy]);
      } else if (name=='data'&&util.isPlainObject(src) ){
        target[name] = extend(src,copy)
      } else {
        target[name] = copy;
      }  
  }
}());



/**
 * 事件订阅
 * 
*/
class Observable{
  constructor () {
    this._events_ = {};
  }
  _initEvent (events) {
    var keys = getKeys(events);
    for (var i = 0, length = keys.length; i < length; i++) {
      this.on(keys[i], events[keys[i]])
    }
  }
  hasEvent (name) {
    return this._events_.hasOwnProperty(name) && this._events_[name] != null && this._events_[name].length > 0;
  }
  once (name, handler) {
    return this.on(name, handler, true);
  }
  on (name, handler, one, first) {
    var events = this._events_, that = this;
    if (handler == undefined) {
      for (var member in name) {
        that.on(member, name[member], name.one);
      }
      return that;
    }
    if (isArray(name)) {
      for (var i = 0; i < length; i++) {
        that.on(name[i], handler, one);
      }
      return that;
    }
    var eventQueue = events[name] || (events[name] = []);
    if (one) {
      var orgHandler = handler;
      handler = function onceHandler() {
        that.off(name, handler);
        orgHandler.apply(that, arguments);
      }
    }
    eventQueue[first ? 'unshift' : 'push'](handler);
    return this;
  }
  off (name, handler) {
    var len = arguments.length, events = this._events_;
    if (name == undefined) {
      this._events_ = {};
      return;
    }
    if (handler == undefined) {
      this._events_[name] = null;
      return;
    }
    var eventQueue = events[name];
    if (eventQueue) {
      for (var i = eventQueue.length - 1; i >= 0; i--) {
        if (handler == eventQueue[i]) {
          eventQueue.splice(i, 1);
        }
      }
    }
    return this;
  }
  emit () {
    var that = this, args = toArray(arguments), name = args.shift(), events = this._events_, eventQueue = events[name];
    if (eventQueue) {
      eventQueue = eventQueue.slice();
      for (var i = 0, len = eventQueue.length; i < len; i++) {
        eventQueue[i].apply(that, args);
      }
    }
  }
}


/***
 * 扩展页面注册基类
 * Base Page 
 * 
*/
function extendPage(proto)
{
  const observable = new Observable();// 增加页面事件订阅机制
  const app=getApp();
  let defaultProto={
    // 默认自动加载用户信息
    autoLoadUserInfo:true,
    on: observable.on.bind(observable),
    off: observable.on.bind(observable),
    emit: observable.emit.bind(observable),
    /**
     * 页面的初始数据
     */
    data: {
      userInfo:{},
      hasUserInfo:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(this.autoLoadUserInfo)
        {
          this.loadUserInfo();
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

    },
    loadUserInfo:function(){
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
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
    getUserInfo: function (e) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  };
  var pageClass = extendPageOption(defaultProto, proto);
  Page(pageClass);
  return pageClass;
}

module.exports={
  navigateTo,
  extendPageOption,
  startApp,
  extendPage,
  ...util
};