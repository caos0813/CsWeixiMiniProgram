/**
 * 品牌
*/
const { addAPIConfig, getAPIUrl } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('TOTAL', '/order/m/total');// 增加接口映射
addAPIConfig('LIST', '/order/m/list');
addAPIConfig('DETAIL', '/order/m/details');
addAPIConfig('EXPRESS', '/order/m/express');
addAPIConfig('CONFIRM', '/order/m/confirm');
addAPIConfig('CANCEL', '/order/m/cancel');
addAPIConfig('CART_ORDER_CREATE', '/cart/m/create')            // 创建订单
addAPIConfig('GETLAST_INVOICE','/invoice/m/getlast');// 查询发票信息
addAPIConfig('ADD_INVOICE','/invoice/m/save');// 添加发票
addAPIConfig('APPLY_INVOICE','/order/m/invoice');// 申请发票
addAPIConfig('GET_INVOICE','/order/m/invoice');// 根据订单号获取发票
addAPIConfig('PAY_CHECK', '/pay/m/check');// 支付检查
addAPIConfig('PRE_PAY','/pay/m/mini/pre');// 预支付

const getTotal = () => {
  return getRequest('TOTAL');
}

const getExpress = (data) => {
  return getRequest('EXPRESS', data);
}

const confirmOrder = (data) => {
  return postRequest('CONFIRM', data);
}

const cancelOrder = (data) => {
  return postRequest('CANCEL', data);
}

const getList = ({
  pageindex = 1,
  pagesize = 10,
  status = 0,
  provinceid = 0,
  cityid = 0
}, autoShowLoading = true) => {
  return postRequest({
    name: 'LIST',
    data: {
      pageindex,
      pagesize,
      status,
      provinceid,
      cityid
    },
    autoShowLoading
  });
}

const getDetail = (orderNo) => {
  return getRequest('DETAIL', {
    orderNo
  })
}
//添加发票
const saveInvoice = (options, {
  mobile,
  email,
  companyName,
  companyTax,
  invoiceTitleType = 1
}) => {
  options.name ='ADD_INVOICE';
  return postRequest(options, {
    "InvoiceType": 1,//发票类型(1-普通，2-专用) ,
    "InvoiceTitleType": invoiceTitleType, //发票抬头类型(1-个人，2-单位) ,
    "InvoiceContentType": 1,//发票内容类型(1-商品明细，其它待定) ,
    "Mobile": mobile,//Mobile(string): 手机号(必填)
    "Email": email,
    "CompanyName": companyName,
    "CompanyTax": companyTax
  })
}
// 申请发票
const applyInvoice = (options, {
  orderNo,
  mobile,
  email,
  companyName,
  companyTax,
  invoiceTitleType = 1
})=>{
  options.name = 'APPLY_INVOICE';
  return postRequest(options, {
    "orderno": orderNo,
    "invoicetype": 1,//发票类型，1-普通发票，10-专用发票（暂不支持） ,
    "invoicetitletype": invoiceTitleType, //发票抬头类型，1-单位，10-个人 ,
    "invoicecontenttype": 1,//发票内容类型，1-商品明细 ,
    "fullname": companyName,//客户名称，抬头为单位时必填(若为个人则默认为收货人名字) ,
    "tel": mobile,// 客户电话 ,
    "email": email, //客户邮箱 ,
    "tin": companyTax //客户纳税人识别号，抬头为单位时必填
  })
}

// 获取发票信息
const getInvoiceInfo = (options, { orderNo}) => {
  options.url = getAPIUrl('GET_INVOICE') + `/${orderNo}`;
  return postRequest(options)
}

//查询发票
const getLastInvoiceList = (options, invTitleType)=>{
  options = options||{};
  options.name ='GETLAST_INVOICE';
  options.data={
    invTitleType
  }
  return getRequest(options)
}

// 创建订单
const createOrder = (addressId, invinfo, data) => {
  data.url = getAPIUrl('CART_ORDER_CREATE') + `/${addressId}?invinfo=${invinfo}`
  return postRequest(data)
}
// 支付检查
const checkPay = (options, { orderNo }) => {
  options.url = getAPIUrl('PAY_CHECK') + `/${orderNo}`;
  return getRequest(options)
}

// 预支付
const prePay = (options) => {
  options.name ="PRE_PAY";
  return postRequest(options)
}
module.exports = {
  getTotal,
  getList,
  getDetail,
  getExpress,
  confirmOrder,
  cancelOrder,
  saveInvoice,
  applyInvoice,
  getInvoiceInfo,
  checkPay,
  prePay,
  getLastInvoiceList,
  createOrder
}