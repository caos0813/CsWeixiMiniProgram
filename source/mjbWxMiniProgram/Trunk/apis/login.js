/**
 * 登录授权相关
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('AUTH', '/wx/m/getopenid');
addAPIConfig('GET_SHOPID', '/wx/m/getshopid');
addAPIConfig('AUTO_LOGIN', '/wx/m/miniautologin');

addAPIConfig('GET_CODE', '/user/m/getcode');
addAPIConfig('LOGIN', '/user/m/login');

const getAuth = (data, autoShowLoading = false) => {
  return getRequest({
    name: 'AUTH',
    data: data,
    autoShowLoading
  });
};

const autoLogin = (autoShowLoading = false) => {
  return getRequest({
    name: 'AUTO_LOGIN',
    autoShowLoading
  });
};

const getCode = (phone => {
  return postRequest('GET_CODE', {
    mobile: phone,
    smstype: 1
  });
});

const login = (data => {
  return postRequest('LOGIN', data);
});

const getShopId = (autoShowLoading = false) => {
  return getRequest({
    name:"GET_SHOPID",
    header:{
      shopid:1
    },
    autoShowLoading
  });
};

module.exports = {
  getAuth,
  getCode,
  login,
  getShopId,
  autoLogin
}