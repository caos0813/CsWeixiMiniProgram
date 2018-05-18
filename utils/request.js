/**
 * 网络请求
 * 
 */
const {
    getAPIUrl
} = require('./config.js')
const {
    extend,
    wrapPromise,
    isPlainObject,
    Callbacks,
    isFunction
} = require('./util.js')
// 后台响应状态码
const responseStatusMsg = {
    "401": "TOKEN失效 !",
    "402": "shopid 失效既无此店铺"
};
const responseStatusCode = {
    NORMAL: 1,                  //正常结果
    UNAUTHORIZED: 401,          //TOKEN失效
    SHOPID_INVALID: 402,        //shopid 失效既无此店铺
    VERICODE_INVALID: 3103,     //验证码失效
    VERICODE_ERR: 3104,         //验证码错误
    VERICODE_LIMITEDERR: 3101,  //验证码达到上限
    VERICODE_IPERR: 3102,       //验证码IP达到上限
    USRINFO_GET_FAIL: 3122,     //获取用户信息失败
    GOODS_NO_RESULT: 3309,      //没找到商品,
    GOODS_NOT_FOUND: 3301,      //商品不存在
    ADDR_NUM_LIMITED: 3158,     //地址达到上限
    CARTS_NUM_LIMIT: 3401,      //购物车商品上限，店铺为单位
    SHOP_GET_FAIL: 3402,        //店铺未找到	
    NO_GOODS_ADDR: 3604,        //商品不在配送区域
    CANNOT_CHANGE_ADDR: 3605,   //不允许修改地址
    ORDER_SKU_ERROR: 3611,      //待付款订单支付时，SKU异常
    RETURN_HAS_ALREADY: 3802,   //售后单已存在退货单	
    AS_HAS_ALREADY: 3803,       //订单已存在售后单	
    AS_MONEY_BIG: 3804,         //售后单申请退款金额不能大于订单的实收金额	
    AS_MONEY_SMALL: 3805,       //售后单申请退款金额不能小于0
    EXPNO_HAS_ALREADY: 3808     //快递单号已使用过	
};
// 公共header
let requestHeader = {
    shopid: null,
    openid: null
}
// 设置公共header
function setCommonHeader(name, value) {
    requestHeader[name] = value;
}

/**
 * 处理request Options
 */
function processOptions(options) {
    if (options.name) {
        options.url = getAPIUrl(options.name)
    }
    if (!isPlainObject(options.header)) {
        options.header = {}
    }
    if (requestHeader.shopid) {
        options.header.shopid = requestHeader.shopid;
    }
    //application/x-www-form-urlencoded
    //options.header['content-type'] = 'application/json' // 默认值
    if (false) {
        options.header.openid = requestHeader.openid;
    }
    return options;
}

/**
 * 请求网络
 * @param {object} options 请求参数
 * @return {promise}
 */
function request(options = {
    name: '',               //  接口配置映射名称
    url: '',                //	String	    是		开发者服务器接口地址	
    data: null,             //	Object/ String / ArrayBuffer	否		请求的参数	
    header: null,           //	Object	    否		    设置请求的 header，header 中不能设置 Referer。
    method: "GET",          //	String	    否	GET	    （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT	
    dataType: "json",       //  String	    否	json	如果设为json，会尝试对返回的数据做一次 JSON.parse	
    responseType: "text",   //	String	    否	text	设置响应的数据类型。合法值：text、arraybuffer	1.7.0
    success: null,          //	Function	否		    收到开发者服务成功返回的回调函数	
    fail: null,             //	Function	否		    接口调用失败的回调函数	
    complete: null,         //	Function	否		    接口调用结束的回调函数（调用成功、失败都会执行）
    isCustomError: false    // 是否自定义错误，
}) {

    let successCallback = Callbacks('once memory');
    let failCallback = Callbacks('once memory');
    let completeCallback = Callbacks('once memory');
    let abortCallback = Callbacks('once memory');
    let {
        isCustomError,
        url,
        success,
        fail,
        complete
    } = processOptions(options); // 针对options加工，分离处理逻辑

    /**
     * 成功回调处理
     */
    function successHandler({ data, statusCode, header }) {
        const code = data.code;
        // 后台返回成功状态码
        if (code === responseStatusCode.NORMAL) {
            successCallback.fire(data);
        } else if (code === responseStatusCode.UNAUTHORIZED) {

        }
    }
    /**
     * 失败回调处理
     */
    function failHandler() {
        if (isCustomError) {
            failCallback.fire();
            return;
        }
    }
    // 兼容wx原生使用处理
    if (isFunction(success)) {
        successCallback.add(success);
    }
    // 兼容wx原生使用处理
    if (isFunction(fail)) {
        successCallback.add(fail);
    }
    // 兼容wx原生使用处理
    if (isFunction(complete)) {
        completeCallback.add(complete)
    }
    options.success = successHandler;
    options.fail = failHandler;
    options.complete = completeCallback.fire;
    let ajax = new Promise((resolve, reject) => {
        successCallback.add(failCallback.disable, resolve);
        failCallback.add(successCallback.disable, reject);
        let ajax = wx.request(options);
        abortCallback.add(failCallback.disable, successCallback.disable, ajax.abort.bind(ajax));
    });
    // 终止
    ajax.abort = request.abort = function () {
        abortCallback.fire();
    }
    return ajax;
}

function createRequest(method = 'GET') {
    return function (name, data = {}) {
        let options = {
            method,
            data
        }
        if (isPlainObject(name)) {
            options = extend(options, name)
        } else {
            options.name = name;
        }

        return request(options);
    }
}
let postRequest = createRequest('POST');
let getRequest = createRequest('GET');
module.exports = {
    setCommonHeader,
    request,
    getRequest,
    postRequest
}