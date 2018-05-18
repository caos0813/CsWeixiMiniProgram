/**
 * 封装wx常用API-begin 方便使用
 * **/
const {
    extend,
    wrapPromise,
    isPlainObject,
    Callbacks,
    isFunction
} = require('./util.js')


let wxAPIKeys = [
    // 导航
    'navigateTo',
    'redirectTo',
    'switchTab',
    'reLaunch',
    'navigateBack',
    // 界面交互
    'showToast'
];
let excludePromise = ['navigateBack'];
let originWxAPI = {};

// 先对wxAPI进行Promise包装
wxAPIKeys.forEach(name => {
    if (wx[name]) {
        let fn = wx[name];
        originWxAPI[name] = excludePromise.indexOf(name) != -1 ? wrapPromise(fn) : fn;
    }
})

let wxAPI = Object.create(originWxAPI);

/*
注意：目前页面路径最多只能十层。
导航
保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。

url	        String  	是	需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
success	    Function	否	接口调用成功的回调函数
fail	    Function	否	接口调用失败的回调函数
complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
*/

wxAPI.navigateTo = function (url) {
    return originWxAPI.navigateTo({
        url: url
    })
}


// 界面
wxAPI.showToast = function (title) {
    let options = {
        title: title,   //	String	是	提示的内容	
        icon: null,     //	String	否	图标，有效值 "success", "loading", "none"	
        image: null,    //	String	否	自定义图标的本地路径，image 的优先级高于 icon	1.1.0
        duration: 1500, //	Number	否	提示的延迟时间，单位毫秒，默认：1500	
        mask: false     //  Boolean	否	是否显示透明蒙层，防止触摸穿透，默认：false
    }
    if (isPlainObject(title)) {
        extend(options, title)
    }
    return originWxAPI.showToast(options)
}


module.exports = wxAPI