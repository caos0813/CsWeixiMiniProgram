/**
 * 登录授权相关
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('AUTH', '/wx/m/auth');
addAPIConfig('BIND_OPENID', '/wx/m/bindopenid');
addAPIConfig('GET_SHOPID', '/wx/m/getshopid');

addAPIConfig('GET_CODE', '/user/m/getcode');
addAPIConfig('LOGIN', '/user/m/login');

const getAuth = (data => {
  return getRequest('AUTH', data);
});

const bindOpenid = (data => {
  return getRequest('BIND_OPENID', data);
});

const getCode = (phone => {
  return postRequest('GET_CODE', {
    mobile: phone,
    smstype: 1
  });
});

const login = (data => {
  return postRequest('LOGIN', data);
});

module.exports = {
  getAuth,
  bindOpenid,
  getCode,
  login
}