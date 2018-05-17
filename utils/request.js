/**
 * 网络请求
 * 
*/
const { getUrl, GLOBALVAR } = require('./config.js')
const { extend, resolvePromise, isPlainObject} = require('./util.js')
// 后台响应状态码
const responseStatusCode={
  "001":"您的帐号已在其他手机设备上登录,请重新登录 !",
  "002":"您的登录状态已过期,请重新登录 !",
  "003":"您的帐号已被封至2017年10月30日,如申诉请致电4008517517 !"
};



/*
请求header 处理
*/
class RequestHeader{
  constructor()
  {
    this.headers = [];
  }
  addHeader(name,value)
  {
    this.headers.push({name,value});
  }
  sync(options)
  {
  
    let headers = this.headers, current, len = headers.length, header = options.header;
    if (!len) {
      return;
    }
    if (!isPlainObject(header))
    {
      header=options.header={};
    }
    for(let i=0,len=headers.length;i<len;i++){
      current=headers[i];
      header[current.name]=current.value;
    }
  }
}
let requestHeader = new RequestHeader();


function fireCallback()
{
  let isFire = false, prevArgs, prevContext,list=[];
  function fired()
  {
    var cloneList = list.slice();
    list.length = 0;
    for (let i = 0, len = cloneList.length; i < len; i++) {
      cloneList[i].apply(prevContext, prevArgs);
    }
  }
  let callback= {
    fire(args,context)
    {
      if (isFire)
      {
        return;
      }
      isFire=true;
      prevContext = context;
      prevArgs = args;
      fired();
    },
    add(callback){
      list.push(callback)
      if (isFire)
      {
        fired()
      }

    }

  }

  return callback;
}

/**
 * 请求网络
 * @param {object} options 请求参数
 * @return {promise}
*/
function request(options={
url:'',//	String	是		开发者服务器接口地址	
data:null,//	Object/ String / ArrayBuffer	否		请求的参数	
header:null,//	Object	否		设置请求的 header，header 中不能设置 Referer。
method:"GET",//	String	否	GET	（需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT	
dataType:"json",	//String	否	json	如果设为json，会尝试对返回的数据做一次 JSON.parse	
responseType:"text",//	String	否	text	设置响应的数据类型。合法值：text、arraybuffer	1.7.0
success:null,//	Function	否		收到开发者服务成功返回的回调函数	
fail:null, //	Function	否		接口调用失败的回调函数	
complete:null //	Function	否		接口调用结束的回调函数（调用成功、失败都会执行）
}){
  // 映射名不为空，直接映射接口配置文件
  if(options.name)
  {
    options.url = getUrl(options.name);
  }
   // 设置公共header 跨域
  requestHeader.sync(options);
 
  let { originSuccess, originFail, complete } = options;


  let fireAbort = fireCallback();

  let ajax= new Promise((resolve,reject)=>{      

    /**
     * 公共成功处理
    */
    function successHandler({data, statusCode, header}) {

        resolve(data)
    }
    /**
     * 公共错误处理
    */
    function failHandler() {

    }
    options.success = successHandler;
    options.fail = failHandler;
    let requestTask=wx.request(options);

    fireAbort.add(function(){
      requestTask.abort();
    })

  });
  ajax.abort=function()
  {
    fireAbort.fire();
  }
  return ajax;
}

module.exports={
  requestHeader,
  request
}