// pages/search/searchResult.js
const { getSearchList } = require('../../apis/goods.js');
const wxAPI = require('../../utils/wx-api.js');
const {getImageUrl} = require('../../utils/config.js')
const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    emptyImage: getImageUrl('empty'),
    filterBar: ["newPriority", "synthesize", "sales", "price"],
    goodsArr: [],
    searchValue: "",
    isValue: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // wx.showLoading({
    //   title: "加载中...."
    // });
    if (options.keyValue != "") {
      this.setNextData({
        searchValue: options.keyValue,
        isValue: true
      });
      this.getList(5, 2, options.keyValue);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  getList(orderfield, orderform, search) {
    let provinceid = 0, cityid = 0, pagesize = 10, pageindex = 1, lowerprice = 0, upperprice = 0;
    this.setNextData({
      goodsArr: []
    });
    getSearchList(pagesize, pageindex, lowerprice, upperprice, orderfield, orderform, search).then(res => {
      console.log(res);
      wxAPI.hideLoading();
      if (res.goods.length > 0) {
        this.setNextData({
          goodsArr: this.data.goodsArr.concat(res.goods)
        });
      }else{

      }
    }, () => {
      console.log('fail');
    })
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

  },
  onChange(a) {
    let orderfield = "", orderform = "";
    switch (a.detail.value) {
      case "newPriority":
        orderfield = 5;
        orderform = 2;
        break;
      case "synthesize":
        orderfield = 4;
        orderform = 2;
        break;
      case "sales":
        orderfield = 3;
        orderform = 2;
        break;
      case "price":
        orderfield = 1;
        if (a.detail.sort == "asc") {
          orderform = 1;
        } else {
          orderform = 2;
        }
        break;
    }
    this.getList(orderfield, orderform, this.data.searchValue);
  },
  onFocus(e){
    console.log(e.detail.value);
    wx.navigateTo({
      url: '/pages/search/hotSearch?keyValue=' + e.detail.value
    });
  },
  onInput(e) {
    e.detail.value.length > 0 ? this.setNextData({ isValue: true }) : this.setNextData({ isValue: false });
  },
  onClear() {
    this.setNextData({
      searchValue: ""
    });
  }
})