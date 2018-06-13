// pages/newProducts/list.js
const {
  getNewGoodsList
} = require('../../../apis/goods.js');
const wxAPI = require('../../../utils/wx-api.js');

const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderfield: 5,
    orderform: 2,
    goodsArr: [],
    isShow: true,
    dropDown:0,
    loading: 0,
  },
  onChange(e) {
    this.data.orderform = e.detail.sort;
    this.data.orderfield = e.detail.value;
    this.pager.unlock();
    this.pager.refresh();
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
    this.pager.setTotal(9999999999999); // 接口未返回总记录数，设置
    this.pager.onChange((pageIndex, status) => {
      //点击上面排序过滤作为刷新加载
      if (status == 'refresh') {
        this.data.goodsArr = []; // 请求之前先清空数组
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        this.setNextData({
          scrollTop: 0, //滚动条滚到最前面 
          loading: 0
        })
        this.pager.emit('read'); // 触发read加载数据
        return;
      }
      this.pager.emit(status)
    })
    // 读取时
    this.pager.on('read', () => {
      this.getList().then(goodList => {
        // 没有数据，显示空
        if (goodList.length <= 0) {
          this.setNextData({
            isShow: false
          });
        } else {
          this.setNextData({
            goodsArr: goodList,
            isShow: true
          });
          this.showLoadMore(goodList)
        }
      })
    })

    // 上拉加载下一页时
    this.pager.on('next', () => {
      // 请求之前，显示加载效果
      this.setNextData({
        loading: 1
      })
      this.getList(false).then(goodList => {
        // 追加数据到列表中
        if (goodList.length > 0) {
          this.data.goodsArr.push(...goodList);
          this.setNextData({
            goodsArr: this.data.goodsArr
          });
        }
        this.showLoadMore(goodList)

      })
    })
    this.pager.read();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  getList: function (autoShowLoading = true) {
    return getNewGoodsList({
      orderfield: this.data.orderfield,
      orderform: this.data.orderform,
      pageindex: this.pager.pageIndex
    }, autoShowLoading)
  },
  showLoadMore(goodList) {
    // 如果结果集长度小于当前页大小，代表数据读到最后一页了
    if (goodList.length < this.pager.pageSize) {
      this.pager.lock(); //没有下一页，锁住分页，不进行下一页   
      // 显示没有更多数据了
      this.setNextData({
        loading: 2
      })
    } else {
      // 隐藏加载效果
      this.setNextData({
        loading: 0
      })
    }
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
    this.pager.next();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})