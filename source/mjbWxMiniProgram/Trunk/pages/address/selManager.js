// pages/address/manager.js

const { getAddressList, setDefaultAddress, setModifyAddress } = require('../../apis/address.js')
const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    formOrder: false,  // 是否来自待付款页面
    orderNo: 0,
    address_id: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderNo) {
      this.setData({
        formOrder: true,
        orderNo: options.orderNo,
      })
    } else {
      this.setData({
        address_id: options.address_id,
      })
    }
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
      let list = res
      if (!list || list.length ==0) {
        return;
      }
      for (let i=0; i<list.length; i++) {
        if (list[i].address_id == that.data.address_id) {
          list[i].defaultSel = true;
        } else {
          list[i].defaultSel = false;
        }
      }
      that.setData({
        address: list
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

  // 设置
  addressDefault: function (e) {
    let that = this;
    let idx = e.currentTarget.dataset.index;
    let address = that.data.address[idx];
    if (this.data.formOrder) {
      setModifyAddress({
        areaId: address.areadid == 0 ? address.areacid : address.areadid,
        fullName: address.contact_name,
        orderNo: that.data.orderNo,
        street2: address.address_detail,
        tel: address.mobile
      }).then(function(res){
        wx.redirectTo({
          url: '/pages/order/detail/detail'
        })
      })
    } else {
      that.setPageStorageData({
        address: address
      })
      that.mjd.navigateBack();
    }
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