/**
 * 满金店公共框架
 * 
 */
const {
    GLOBALVAR
} = require('./config.js')
const util = require('./util.js')
const requestExport = require('./request.js')
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
    mergeHandler
} = util
let mjd = {}




/**
 * 启动APP
 * 
 */
function startApp() {
    let app = App({

        // 全局只执行一次
        onLaunch: function () {
            console.log('onLaunch');

            // APP启动前获取并设置SHOPID
            requestExport.setCommonHeader('shopid', 7);

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
        onShow() {
            console.log('app-show');
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
        // 全局
        GLOBALVAR: GLOBALVAR,
        Page: extendPage, // 注册页面
        Component: extendComponent, // 注册组件
        globalData: {
            userInfo: null
        }
    });

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
            target[name] = mergeHandler([src, copy]);
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
/***
 * 扩展页面注册基类
 * Base Page 
 * 
 */
function extendPage(proto) {
    const observable = new Observable(); // 增加页面事件订阅机制
    const app = getApp();
    let defaultProto = {
        mjd: mjd,
        // 默认自动加载用户信息
        autoLoadUserInfo: true,
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
    const observable = new Observable(); // 增加页面事件订阅机制
    let defaultProto = {
        mjd: mjd,
        // 默认自动加载用户信息
        autoLoadUserInfo: true,
        on: observable.on.bind(observable),
        off: observable.on.bind(observable),
        emit: observable.emit.bind(observable),
        properties: {},
        data: {},
        created() {},
        ready() {

        }
    };
    var componentProto = extendComponentOption(defaultProto, proto);
    Component(componentProto);
    return componentProto;
}


module.exports = mjd = {
    extendPageOption,
    startApp,
    extendPage,
    ...util,
    ...requestExport,
    ...wxAPi
};