// pages/brandSelection/brandSelection.js   精选大牌
const { getBrandSelectionList } = require('../../../apis/brands.js');
const wxAPI = require('../../../utils/wx-api.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandsArr: [],
    isLoading: false,
    loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    })
    this.pager.setTotal(9999999999999);// 接口未返回总记录数，设置
    // 页变化
    this.pager.onPageChange(function (pageIndex) {
      console.log(pageIndex)
      that.showData(false)
    })
    // 页数发生变化
    this.pager.onPageCountChange(function () {
      console.log(this.pageCount, this.pageIndex);
    })
    // 刷新时
    this.pager.onRefresh(function () {
      this.unlock();// 刷新时解锁
      that.data.brandsArr = [];
      that.showData(false).then(() => {
        that.mjd.stopPullDownRefresh()
      })
    })
    this.showData();
  },
  showData: function (autoShowLoading = true) {
    return getBrandSelectionList({
      pageindex: this.pager.pageIndex
    }, autoShowLoading).then(brandsArr => {
      this.setData({
        isLoading: false
      });
      if (brandsArr.length > 0) {
        this.data.brandsArr.push(...brandsArr);
        this.setData({ 
          brandsArr: this.data.brandsArr 
        });
      } 
      if (brandsArr.length < this.pager.pageSize) {
        this.setData({
          loaded: true
        });
        this.pager.lock();//当没有数据了，代表没有下一页，锁住分页，不进行下一页
      }
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
  onReachBottom: function (e) {
    if(!this.data.loaded) {
      this.setData({
        isLoading: true
      });
    }
    this.pager.next();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})