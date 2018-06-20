// pages/brand/brandGoods/brandGoods.js  品牌商品列表页
const { getGoodsByBrand } = require('../../../apis/goods.js');
const wxAPI = require('../../../utils/wx-api.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      orderfield: 4, // 1.价格排序 2.收益排序 3.销量排序 4.综合排序 5.新品优先
      orderform: 0, // 1.升序 2.降序 
      lowerprice: 0,
      upperprice: 0,
      provinceid: 0,
      cityid: 0,
      brandid: 0,
      pagesize: 10,
      pageindex: 1
    },
    goodsList: [],
    isLoading: false,
    loaded: false,
    brandlogo: '',
    brandbackgrdpic: '',
    brandbriefintro: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.brandname,
    });
    this.setData({
      'params.brandid': options.brandid,
      brandlogo: options.brandlogo,
      brandbackgrdpic: options.brandbackgrdpic,
      brandbriefintro: options.brandbriefintro,
    });
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
      that.data.goodsList = [];
      that.showData(false).then(() => {
        that.mjd.stopPullDownRefresh()
      })
    })
    this.showData();
  },
  showData: function (autoShowLoading = true) {
    return getGoodsByBrand({
      pageindex: this.pager.pageIndex,
      brandid: this.data.params.brandid
    }, autoShowLoading).then(goodsList => {
      this.setData({
        isLoading: false
      });
      if (goodsList.length > 0) {
        this.data.goodsList.push(...goodsList);
        this.setData({
          goodsList: this.data.goodsList
        });
      }
      if (goodsList.length < this.pager.pageSize) {
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
  onReachBottom: function () {
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