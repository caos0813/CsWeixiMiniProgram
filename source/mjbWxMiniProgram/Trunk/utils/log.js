
const { addAPIConfig, getAPIUrl } = require('../utils/config.js');
const { getRequest, postRequest, request } = require('../utils/request.js');
addAPIConfig('writeLog','/server/m/getlog')

const formatParams = (params = {}) => {
  const paramsArr = [];
  const paramKeys = Object.keys(params);
  if (paramKeys.length > 0) {
    paramKeys.forEach((key) => {
      paramsArr.push(`${key}=${params[key]}`);
    });
  }
  return paramsArr.join('&');
};

const getBasicParams = () => {
  const params = {};

  params.domain =  '';
  params.url = '';
  params.title =  '';
  params.referrer =  '';

  params.sh =  0;
  params.sw = 0;

  return formatParams(params);
};


 const captureException = (level = 1, message = '') => {
  let msg = message;
  let lv = level;

  if (typeof level === 'string') {
    lv = 1;
    msg = level;
  }
  if (!msg) {
    return;
  }
  msg = encodeURIComponent(`${getBasicParams()}&message=${msg}`);
  return postRequest({
    name:'writeLog',
    data:{
      level,
      msg
    }
  })
};
module.exports={
  captureException
}