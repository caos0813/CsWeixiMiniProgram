const { gethotsearch } = require('../../apis/goods.js');
const wxAPI = require('../../utils/wx-api.js');
const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    // historyList: ["连衣裙", "华为", "苹果手机"],
    historyList: [],
    hotSearchList: [],
    arr: [],
    isValue:false,
    searchValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.keyValue != "") {
      this.setNextData({
        searchValue: options.keyValue,
        isValue: true
      });
    }
    var value = wx.getStorageSync("historyList");
    this.setNextData({
      historyList: value,
      arr:value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 读取热门搜索数据
    gethotsearch().then(list => {
      this.setNextData({ hotSearchList: list })
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
  onInput(e){
    e.detail.value.length > 0 ? this.setNextData({ isValue: true }) : this.setNextData({ isValue: false });
  },
  
  onConfirm(e) {
    this.data.arr.push(e.detail.value);
    this.setNextData({
      searchValue:e.detail.value,
      historyList: this.data.arr
    });
    wx.setStorageSync("historyList", this.data.historyList);
    this.navigateToPage(this.data.searchValue);
  },
  onCancel() {
    wx.navigateBack();
  },
  onClear() {
    this.setNextData({
      searchValue: ""
    });
  },
  onSearch(item){
    this.navigateToPage(item.target.dataset.item);
  },
  navigateToPage(value){
    wx.navigateTo({
      url: '/pages/search/searchResult?keyValue='+value
    })
  }
})