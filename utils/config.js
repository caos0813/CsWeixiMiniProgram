/**
 * 项目公共资源配置文件
 * ***/


// 全局变量
const GLOBALVAR={


};

// 服务器地址
const SERVERS={
  // 默认接口数据服务器
  "default":'http://wwww.aaa/',
  //socket服务器
  "socket":'',
   //图片服务器
   "image":""
};
// 资源配置
const configs={
  "getList":"/list/getList"
};
/**
 * @param {string} name 接口映射名
 * @return {string} 接口完整路径
*/
function getUrl(name,serverName='default'){
  var server = SERVERS[serverName];
  var url = configs[name];
   if (!server) {
    throw "config  not found server " + server;
  }
   if (!url || !server) {
      throw "config  not found " + name;
    }
    if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
      return url;
    }
    return server + url;
}
module.exports={
  getUrl,
  GLOBALVAR
}