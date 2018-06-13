/**
 * 网络请求
 * 
 */
const {
  getAPIUrl
} = require('./config.js');

const {
  isArray,
  extend,
  wrapPromise,
  isPlainObject,
  Callbacks,
  isFunction,
  Observable
} = require('./util.js');
const wxAPI = require('./wx-api.js')
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
  EXPNO_HAS_ALREADY: 3808,    //快递单号已使用过	
  GET_OPENID_FAIL: 3901,      //获取openid失败
};
// 公共header
let requestHeader = {
}
// 设置公共header
function setCommonHeader(name, value) {
  requestHeader[name] = value;
}

// 公共data
let requestData= {
}
// 设置公共data
function setCommonData(name, value) {
  requestData[name] = value;
}

/**
 * 处理request Options
 */
function processOptions(options) {
  if (options.name) {
    options.url = getAPIUrl(options.name)
  }
  if (!isPlainObject(options.data) && !isArray(options.data)) {
    options.data = {}
  }
  if (isPlainObject(options.data)){
    options.data = extend({},requestData, options.data)
  }  
  if (!isPlainObject(options.header)) {
    options.header = {}
  }
  options.header = extend({}, requestHeader, options.header);
  //application/x-www-form-urlencoded
  //options.header['content-type'] = 'application/json' // 默认值
  return options;
}
let requestCount = 0, isShowLoading = false;
const requestObservable = new Observable()
requestObservable.on('before', function (options) {
  if (requestCount++ == 0) {
    this.emit('start', options)
  }
})
requestObservable.on('complete', function () {
  if (--requestCount <= 0) {
    requestCount = 0;
    this.emit('stop')
  }
})


requestObservable.on('start', function (options) {
  if (!isShowLoading && options.autoShowLoading) {
    isShowLoading = options.autoShowLoading;
    wxAPI.showLoading(options.showLoadingText)
  }
})
requestObservable.on('stop', function (options) {
  if (isShowLoading) {
    isShowLoading = false;
    wxAPI.hideLoading()
  }
  // 所有请求结束之后，检查因token请求失败的接口，重新发起请求
  if (tokenRerequests.length){
    var tokenRerequestsCopy = tokenRerequests.slice();
    tokenRerequests.length = 0;
    exports.loginGetAuth(tokenRerequestHanlder(tokenRerequestsCopy));
  }
})
function tokenRerequestHanlder(tokenRerequests)
{
  return function(){
    while (tokenRerequests.length) {
      let fn = tokenRerequests.shift();
      fn();
    }
  }
}
// 重新请求,
let tokenRerequests = [];


/**
 * 请求网络
 * @param {object} options 请求参数
 * @return {promise}
 */
function request(options) {
  let originOptions = options;
  options = extend({
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
    isCustomError: false,    // 是否自定义错误，
    autoShowLoading: true,
    isExtendData:true,
    showLoadingText: '加载中...',
    isWrapSuccess:true // false:成功返回函不进行任何包装，直接回调
  }, options || {})
  let successCallback = Callbacks('once memory');
  let failCallback = Callbacks('once memory');
  let completeCallback = Callbacks('once memory');
  let abortCallback = Callbacks('once memory');
  let {
    isWrapSuccess,
    isCustomError,
    url,
    success,
    fail,
    complete,
    } = processOptions(options); // 针对options加工，分离处理逻辑

  // 触发
  requestObservable.emit('before', options);
  completeCallback.add(requestObservable.emit.bind(requestObservable, 'complete'))


  // 重新发起请求
  function rerequest()
  {
    return request(originOptions).then(successCallback.fire, failCallback.fire);
  }
  /**
   * 成功回调处理
   */
  function successHandler({ data, statusCode, header }) {
    const { code, data: resultData, message } = data;
    // 后台返回成功状态码
    if (code === responseStatusCode.UNAUTHORIZED){
      tokenRerequests.push(rerequest);
    } 
    else if (!isWrapSuccess) {
      successCallback.fire(data);
     }else if (code === responseStatusCode.NORMAL) {
       successCallback.fire(resultData);
    } else {
       failHandler(message)
    }
  }
  /**
   * 失败回调处理
   */
  function failHandler(message) {
    if (isCustomError) {
      failCallback.fire(message);
      return;
    }
    wxAPI.showToast({ title: message||'请求失败！',icon:'none' })
  }
  // 兼容wx原生使用处理
  if (isFunction(success)) {
    successCallback.add(success);
  }
  // 兼容wx原生使用处理
  if (isFunction(fail)) {
    failCallback.add(fail);
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

const uploadFile=(name,options)=>{
  options.url = getAPIUrl(name)
  if (!isPlainObject(options.formData)) {
    options.formData = {}
  }
  if (isPlainObject(options.formData)) {
    options.formData = extend({}, requestData, options.formData)
  }
  if (!isPlainObject(options.header)) {
    options.header = {}
  }
  options.header = extend({}, requestHeader, options.header);
 
  return wx.uploadFile(options);
}

let exports = {
  responseStatusCode,
  setCommonData,
  setCommonHeader,
  request,
  getRequest,
  postRequest,
  uploadFile
}
module.exports = exports;