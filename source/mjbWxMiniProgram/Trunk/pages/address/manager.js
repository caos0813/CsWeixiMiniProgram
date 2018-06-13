// pages/address/manager.js

const { getAddressList, setDefaultAddress, delAddress } = require('../../apis/address.js')
const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    getAddressList().then(function(res){
      that.setData({
        address: res
      })
    })
  },

  // 添加地址
  addNew: function () {
    wx.navigateTo({
      url:'newAddress'
    })
  },

  // 编辑地址
  addressEdit: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'newAddress?address_id=' + id
    })
  },

  // 删除地址
  addressDel: function (e) {
    let that = this;
    let idx = e.currentTarget.dataset.index;
    let address = that.data.address;
    if (that.data.address[idx].default_flag == 1) {
      wx.showToast({
        icon: 'none',
        title: '不能删除默认地址！',
        duration: 2000
      })
      return;
    }
    wx.showModal({
      content: '确定删除该收货地址吗？',
      success: function(res) {
        if (res.confirm) {
          delAddress({
            addressid: that.data.address[idx].address_id
          }).then(function(success){
            for (let i=0; i<address.length; i++) {
              if (idx == i) {
                address.splice(i,1);
                break;
              }
            }
            that.setData({
              address: address,
            })
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  // 设置默认地址
  addressDefault: function (e) {
    let idx = e.currentTarget.dataset.index;
    let that = this;
    let address = that.data.address
    setDefaultAddress({
      addressid: that.data.address[idx].address_id
    }).then(function(res){
      for (let i=0; i<address.length; i++) {
        if (idx == i) {
          address[i].default_flag = 1;
        } else {
          address[i].default_flag = 0;
        }
      }
      that.setData({
        address: address,
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})