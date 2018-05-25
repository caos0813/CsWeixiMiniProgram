/**
 * 项目公共资源配置文件
 * ***/
const GLOBALVARS = {
    env: 'development' //production
}
// 服务器地址
const SERVERS = {
    // 默认接口数据服务器
    "api":"https://api.manjd.com/api",// 正式环境
    "devApi": 'https://devapi.manjd.com/api',// 开发环境
    "testApi":'https://checkapi.manjd.com/api',// 测试环境
    //socket服务器
    "socket": '',
    //图片服务器
    "image": "http://192.168.10.65:168/images"
};
let configs = {}
let addAPIConfig = createConfig('testApi');
let getAPIUrl = createReadConfig('testApi');

let addImageConfig = createConfig('image');
let getImageUrl = createReadConfig('image');

addImageConfig('empty','/public-empty.png')


function createConfig(name) {
    var _configs = configs[name] = {};
    return function (name, value) {
        if (_configs[name]) {
            throw new Error('该配置名已存在')
        }
        _configs[name] = value;
    }
}

function createReadConfig(serverName) {
    var  serverAddress = SERVERS[serverName];
    var _configs = configs[serverName];
    return function (name) {
        let url = _configs[name];
        if (!url) {
            throw "config  not found " + name;
        }
        if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
            return url;
        }
        return serverAddress + url;
    }
}

module.exports = {
    GLOBALVARS,
    addImageConfig,
    getImageUrl,
    addAPIConfig,
    getAPIUrl,
    SERVERS
}