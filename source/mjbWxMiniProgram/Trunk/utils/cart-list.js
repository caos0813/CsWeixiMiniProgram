const { postCartList, postCartListTrue, updateCartAdd } = require('../apis/cart.js');
const { isArray } = require('./util.js');


/**
 * 设置购物车缓存
 *
 * @param {object} data
 * @param {array} data
 */

function setCartList(data) {
  let getToken = wx.getStorageSync('token');
  let listData = wx.getStorageSync('CartList');

  if (getToken && !isArray(data)) {
    updateCartAdd(data).then(function(res){
      //...
    })
    return
  }

  if (listData) {
    listData = JSON.parse(listData);
    if (isArray(data)) {
      let arr = [];
      let obj = {};
      for (let i = 0; i < listData.length; i++) {
        obj[listData[i]] = i;
      }
      for (let i = 0; i < data.length; i++) {
        if (obj[data[i]]) {
          listData[i].shopnum += data[i].shopnum
        } else {
          listData.push(data[i])
        }
      }
    } else {
      for (let i = 0; i < listData.length; i++) {
        if (data.skuid == listData[i].skuid) {
          listData[i].shopnum += data.shopnum
        } else {
          listData.push(data);
        }
      }
    }
    wx.setStorageSync('CartList', JSON.stringify(listData))
  } else {
    if (isArray(data)) {
      wx.setStorageSync('CartList', JSON.stringify(data))
    } else {
      let arr = [];
      arr.push(data)
      wx.setStorageSync('CartList', JSON.stringify(arr))
    }
  }
}

/**
 * 获取购物车数量
 */

function getCartNum(cb) {
  let getToken = wx.getStorageSync('token');
  let listData = wx.getStorageSync('CartList');
  let allNum = 0;
  if (!listData) {
    cb && cb(allNum)
    return;
  }
  if (getToken) {
    listData = JSON.parse(listData);
    postCartList(listData).then(function (res) {
      if (!res.list || res.list.length == 0) {
        cb && cb(allNum);
        return;
      }
      for (let i = 0; i < res.list.length; i++) {
        allNum += res[i].list.shopnum;
      }
      cb && cb(allNum)
    }).catch(function (err) {
      cb && cb(allNum)
    })
  } else {
    for (let i = 0; i < listData.length; i++) {
      allNum += listData[i].shopnum;
    }
    cb && cb(allNum)
  }
}

/**
 * 获取购物车已选择列表
 */

function getCartList(cb) {
  postCartListTrue().then(function(res){
    cb && cb(res)
  }).catch(function(err){
    console.log(err)
  })
} 


module.exports = {
  setCartList,
  getCartList,
  getCartNum
}