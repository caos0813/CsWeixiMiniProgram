/**
 * 收货地址
 */
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('ADDRESS_LIST', '/address/m/getlist');             // 收货地址列表页
addAPIConfig('GET_EDIT_ADDRESS', '/address/m/getarealist');     // 获取被编辑的收货地址
addAPIConfig('EDIT_ADDRESS', '/address/m/edit');                // 编辑收货地址
addAPIConfig('ADD_ADDRESS', '/address/m/add');                  // 新增收货地址
addAPIConfig('SET_DEFAULT_ADDRESS', '/address/m/setdefault');   // 设置默认地址
addAPIConfig('DEL_ADDRESS', '/address/m/delete');               // 删除地址
addAPIConfig('GET_STREET_LIST', '/address/m/getarealist');      // 获取街道地址
addAPIConfig('GET_ADDRESS_TAG_LIST', '/addresstag/m/getlist');  // 获取个人地址标签
addAPIConfig('GET_ADDRESS_ID', '/address/m/getaddressbyid');    // 获取个人地址详细
addAPIConfig('SET_MODIFY_ADDRESS', '/order/m/modifyAddress');   // 修改订单收货地址

// 收货地址列表页
const getAddressList = (autoShowLoading = true) => {
  return getRequest({
    name: 'ADDRESS_LIST',
    autoShowLoading
  });
}

// 获取被编辑的收货地址
const getEditAddress = () => {
  return getRequest({
    name: 'GET_EDIT_ADDRESS',
    data: {}
  });
}

// 获取街道地址
const getStreetList = ({area_id = 0}) => {
  return getRequest({
    name: 'GET_STREET_LIST',
    data: {
      area_id
    }
  });
}

// 设置默认地址
const setDefaultAddress = ({addressid = 0},autoShowLoading = true) => {
  return postRequest({
    name:'SET_DEFAULT_ADDRESS',
    data: {
      addressid
    },
    autoShowLoading // 自动加载;
  });
}

// 删除地址
const delAddress = ({addressid = 0},autoShowLoading = true) => {
  return postRequest({
    name:'DEL_ADDRESS',
    data: {
      addressid
    },
    autoShowLoading // 自动加载;
  });
}

// 编辑收货地址
const editAddress = ({
  defaultflag = 0,
  addressid = 0,
  countryid = 0,
  addrlabelid = 0,
  streetid = 0,
  contactname = "",
  mobile = "",
  telephone = "",
  addressdetail = "",
  addresszip = "",
}, autoShowLoading = true) => {
  return postRequest({
    name: 'EDIT_ADDRESS',
    data: {
      defaultflag,
      addressid,
      countryid,
      addrlabelid,
      streetid,
      contactname,
      mobile,
      telephone,
      addressdetail,
      addresszip,
    },
    autoShowLoading // 自动加载中;
  })
}

// 新增收货地址
const addAddress = ({
  defaultflag = 0,
  addressid = 0,
  countryid = 0,
  addrlabelid = 0,
  streetid = 0,
  contactname = "",
  mobile = "",
  telephone = "",
  addressdetail = "",
  addresszip = "",
}, autoShowLoading = true) => {
  return postRequest({
    name: 'ADD_ADDRESS',
    data: {
      defaultflag,
      addressid,
      countryid,
      addrlabelid,
      streetid,
      contactname,
      mobile,
      telephone,
      addressdetail,
      addresszip,
    },
    autoShowLoading // 自动加载中;
  })
}

// 获取个人地址标签
const getAddressTagList = () => {
  return getRequest({
    name: 'GET_ADDRESS_TAG_LIST'
  });
}

// 获取个人地址标签
const getAddressId = ({
  address_id = 0,
}) => {
  return getRequest({
    name: 'GET_ADDRESS_ID',
    data: {
      address_id
    }
  });
}

//
const setModifyAddress = ({
  areaId= 0,
  fullName= "",
  orderNo= "",
  street2= "",
  tel= ""
}) => {
  return postRequest({
    name: 'SET_MODIFY_ADDRESS',
    data: {
      areaId,
      fullName,
      orderNo,
      street2,
      tel,
    }
  });
}

module.exports = {
  getAddressList,
  getEditAddress,
  editAddress,
  addAddress,
  setDefaultAddress,
  delAddress,
  getStreetList,
  getAddressTagList,
  getAddressId,
  setModifyAddress,
}