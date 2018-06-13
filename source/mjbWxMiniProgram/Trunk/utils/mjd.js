/**
 * 满金店公共框架
 * 
 */
const {
  GLOBALVAR
} = require('./config.js')
const util = require('./util.js')
let requestExport = require('./request.js')
const wxAPi = require('./wx-api.js')
const {
  getKeys,
  each,
  extend,
  hasOwnProperty,
  toArray,
  isArray,
  wrapPromise,
  Observable,
  mergeHandler,
  Scheduler,
  Callbacks
} = util
let mjd = {}

const { getAuth, getShopId, autoLogin } = require('../apis/login.js');



/**
 * 启动APP
 * 
 */
function startApp() {
  const shopCallback = Callbacks('once memory');

  let app = App({
    // 全局只执行一次
    onLaunch: function (e) {
      // 获取设置信息,供全局使用
      try {
        this.globalData.stytemInfo = wx.getSystemInfoSync()
      } catch (e) {
        
      }
      if(e.query.shopid) {
        this.globalData.shopid = e.query.shopid;
        requestExport.setCommonHeader('shopid', e.query.shopid);
        shopCallback.fire();
      }else{
        getShopId().then((res) => {
          this.globalData.shopid=res;
          // APP启动前获取并设置SHOPID
          requestExport.setCommonHeader('shopid', res);
          shopCallback.fire();
        }, () => {
          console.log('fail')
        });
      }
      // 设置默认地区
      requestExport.setCommonData('provinceid',0);
      requestExport.setCommonData('cityid', 0);
      requestExport.setCommonHeader('sharesource', 1);

      // 如果有token
      try {
        var token = wx.getStorageSync('token')
        if (token) {
          requestExport.setCommonHeader('token', token);
        }
      } catch (e) {
      }
    },
    shopidcallback(callback){
      shopCallback.add(callback);
    },
    //当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow() {
      
    },
    onHide() {
      // Do something when hide.
    },
    // 处理系统错误
    onError(msg) {

    },
    // 处理404 页面找不到
    onPageNotFound() {

    },
    mjd:mjd,
    // 全局
    GLOBALVAR: GLOBALVAR,
    Page: extendPage, // 注册页面
    Component: extendComponent, // 注册组件
    globalData: {
      shopid:-1,
      stytemInfo:null,
      userInfo: null,
      pageTempData:null // 页面临时数据
    }
  });

}

/**
 * 登录授权
 * 
 */
function checkHasToken() {
  try {
    var token = wx.getStorageSync('token')
    if (token) {
      // Do something with return value
      return true;
    }
  } catch (e) {
    // Do something when catch error
  }
}

function loginGetAuth(callback) {
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        getAuth({
          js_code: res.code
        }).then(res => {
          let open_id = res;
          requestExport.setCommonHeader('miniopenid', open_id);
          autoLogin().then(res => {
            if(res.bindstatus === 1) {
              // 绑定
              requestExport.setCommonHeader('token', res.token);
              wx.setStorage({
                key: "token",
                data: res.token
              });
              callback&&callback();
            }else {
              wx.navigateTo({
                url: `/pages/bind/bind`
              })
            }
          });
        }, () => {
          console.log('fail');
        });
      }
    }
  })
}

let defaultOptionHook = (function () {
  return {
    handler: function (src, copy, name, target, source) {
      target[name] = copy;
    }
  }
}());

function craeteExtendOptions(hooks) {
  hooks = extend({}, defaultOptionHook, hooks)
  return function extendOption(target, source) {
    each(source, (copy, name) => {
      let handler = hooks[name] || hooks.handler;
      if (handler) {
        handler(target[name], copy, name, target, source);
      }
    })
    return target;
  }
}
const extendPageOption = craeteExtendOptions({
  'handler': function (src, copy, name, target, source) {
    if (util.isFunction(src)) {
      target[name] = copy?mergeHandler([src, copy]):src;
    } else {
      target[name] = copy;
    }
  },
  'data': function (src, copy, name, target, source) {
    if (util.isPlainObject(src)) {
      target[name] = extend(src, copy)
    }
  }
});
const extendComponentOption = craeteExtendOptions({
  'handler': function (src, copy, name, target, source) {
    if (util.isFunction(src)) {
      target[name] = mergeHandler([src, copy]);
    } else {
      target[name] = copy;
    }
  },
  'data': function (src, copy, name, target, source) {
    if (util.isPlainObject(src)) {
      target[name] = extend(src, copy)
    }
  },
  'properties': function (src, copy, name, target, source) {
    if (util.isPlainObject(src)) {
      target[name] = extend(src, copy)
    }
  }
});

var PATH_REGEXP = /\[[^\]]+\]|[^.\[]+/g, PATH_KEY_REGEXP = /[\w-]+/;
let setter = function (obj, path, value) {
  let paths = path.match(PATH_REGEXP), key = path, i, len, current = obj;
  if (paths && paths.length > 1) {
    key = paths.pop();
    len = paths.length;
    i = -1;
    if (key.charAt(0) == '[') {
      key = key.match(PATH_KEY_REGEXP)[0]
    }
    while (++i < len && current) {
      current = current[paths[i]];
    }
  }
  if (current){
    current[key]=value;
  }
}
/***
 * 扩展页面注册基类
 * Base Page 
 * 
 */
function extendPage(proto) {
    const orgLoad = proto.onLoad;
    proto.onLoad=null;
    const orgShow= proto.onShow;
    proto.onShow = null;
    const scheduler = new Scheduler();// 性能优化，避免setData 多次触所导致页面卡顿，或性能受损
    const observable = new Observable(); // 增加页面事件订阅机制
    const app = getApp();
    let defaultProto = {
    mjd: mjd,
    // 默认自动加载用户信息
    autoLoadUserInfo: false,
    on: observable.on.bind(observable),
    off: observable.on.bind(observable),
    emit: observable.emit.bind(observable),
    /**
     * 页面的初始数据
     */
    data: {
      userInfo: {},
      hasUserInfo: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (this.autoLoadUserInfo) {
        this.loadUserInfo();
      }
      app.shopidcallback(()=>{
        orgLoad.call(this,options);
      })
  
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },
    setNextData:function(data,callback)
    {
      this.setData(data, callback);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {    
      let temp={};
      if (util.isPlainObject(app.globalData.pageTempData)){
        temp =app.globalData.pageTempData;
        app.globalData.pageTempData=null;
      }
      orgShow&&orgShow.call(this, temp)
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
    setPageStorageData(data)
    {
      app.globalData.pageTempData=data;
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    loadUserInfo: function () {
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
  var pageProto = extendPageOption(defaultProto, proto);
  Page(pageProto);
  return pageProto;
}

/**
 * 组件
 * */
function extendComponent(proto) {
  const scheduler = new Scheduler();// 性能优化，避免setData 多次触所导致页面卡顿，或性能受损
  const observable = new Observable(); // 增加页面事件订阅机制
  let defaultProto = {
    properties: {},
    data: {
    },
    created() { },
    ready() {

    },
    methods:{
      on: observable.on.bind(observable),
      off: observable.on.bind(observable),
      emit: observable.emit.bind(observable),
      setNextData(data,callback){
        this.setData(data,callback)
      }
    }
  };
  if (!proto.behaviors){
    proto.behaviors=[];
  }
  proto.behaviors = proto.behaviors.concat(Behavior(defaultProto));
  Component(proto);
  return proto;
}

requestExport.loginGetAuth=loginGetAuth;

module.exports = mjd = {
  extendPageOption,
  startApp,
  extendPage,
  loginGetAuth,
  checkHasToken,
  ...util,
  ...requestExport,
  ...wxAPi
};