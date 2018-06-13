// pages/logistics/logistics.js
const {
  getExpressList
} = require('../../apis/logistics.js');
const wxAPI = require('../../utils/wx-api.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsList: {
      expressname: "汇通",
      expressno: "71402901028967",
      expressstatus: "1",
      // steps: [{
      //   Context: "订单已签收，期待再次为您服务",
      //   Time: "2017-04-01 12:00:00"
      // }, {
      //   Context: "在分拨中心广东深圳公司进行卸车扫描",
      //   Time: "2017-04-01 12:00:00"
      // }, {
      //   Context: "在广东深圳公司进行发出扫描",
      //   Time: "2017-04-01 12:00:00"
      // }]
      steps:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let shipmentId = 424, expressNo = 71402901028967
    let shipmentId = options.shipmentId, expressNo = options.expressNo;
    getExpressList(shipmentId, expressNo).then(list => {
      this.setData({ logisticsList: list });
    })
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