// pages/newProducts/list.js
const { getNewGoodsList } = require('../../apis/goods.js');
const wxAPI = require('../../utils/wx-api.js');

const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    filterBar: ["newPriority","synthesize","sales","price"],
    goodsArr: []
  },
  onChange(a) {
    let orderfield="",orderform="";
    switch(a.detail.value){
      case "newPriority":
        orderfield=5;
        orderform=2;
        break;
      case "synthesize":
        orderfield=4;
        orderform=2;
        break;
      case "sales":
        orderfield=3;
        orderform=2;
        break;
      case "price":
        orderfield=1;
        if(a.detail.sort=="asc"){
          orderform=1;
        }else{
          orderform=2;
        }
        break;
    }
    this.getList(orderfield,orderform);
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
    wx.showLoading({
      title:"加载中...."
    });
    setTimeout(function(){
      wx.hideLoading()
    },500);
    this.getList(5,2);
  },
  getList(orderfield,orderform){
    let provinceid = 0, cityid = 0,pagesize=10,pageindex=1,lowerprice=0,upperprice=0;
    this.setData({
      goodsArr:[]
    });
    getNewGoodsList(provinceid, cityid,pagesize,pageindex,lowerprice,upperprice ,orderfield,orderform).then(res => {
      this.setNextData({
        goodsArr: this.data.goodsArr.concat(res)
      });
      wxAPI.hideLoading();
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
    
  }
})