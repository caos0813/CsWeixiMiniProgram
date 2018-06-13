/**
 *商品评价
 @dev fanyl
*/
const { getGoodsComment } = require('../../../apis/goods.js')
const { getImageUrl } = require('../../../utils/config.js')
const app = getApp()
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    spuid: -1,
    commentlist: [],
    statistics:{
      commentcount: 0,
      satisfactionval: 0
    },
    isShow: true,
    dropDown: 0,
    loading: 0,
    emptyIcon: getImageUrl('evaluate-empty'),
    isFilterBar: true // 默认显示过滤条
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.spuid = options.spuid;
    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    })
    this.pager.setTotal(9999999999999);// 接口未返回总记录数，设置
    this.pager.onChange((pageIndex, status) => {
      //点击上面排序过滤作为刷新加载
      if (status == 'refresh') {
        this.data.commentlist = [];// 请求之前先清空数组
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        this.setNextData({
          scrollTop: 0,//滚动条滚到最前面 
          loading: 0
        })
        this.pager.emit('read');// 触发read加载数据
        return;
      }
      this.pager.emit(status)
    })
    // 读取时
    this.pager.on('read', () => {
      this.showData().then(({ statistics, commentlist }) => {
        // 没有数据，显示空
        if (commentlist.length <= 0) {
          this.setData({ isShow: false });
        } else {
          this.setData({ commentlist, statistics, isShow: true });
          this.showLoadMore(commentlist)
        }
      })
    })

    // 上拉加载下一页时
    this.pager.on('next', () => {
      // 请求之前，显示加载效果
      this.setNextData({
        loading: 1
      })
      this.showData(false).then(({ statistics, commentlist }) => {
        // 追加数据到列表中
        if (commentlist.length > 0) {
          this.data.commentlist.push(...commentlist);
          this.setData({ commentlist: this.data.commentlist });
        }
        this.showLoadMore(commentlist)

      })
    })
    this.pager.read();
  },
  parseData(commentlist)
  {
    return commentlist.map(d=>{
      let w = this.mjd.getCharWidth(d.filtertext,14);
      let row=w/340;
      d.expandStatus=row>=6?1:0;
      return d;
    })
  },
  showData: function (autoShowLoading = true) {
    return getGoodsComment({
      spuid: this.data.spuid,
      orderform: this.data.orderform,
      pageindex: this.pager.pageIndex,
      autoShowLoading
    }).then(({statistics, commentlist})=>{
      return {
        statistics,
        commentlist: this.parseData(commentlist)
      }
    })
  },
  showLoadMore(commentlist) {
    // 如果结果集长度小于当前页大小，代表数据读到最后一页了
    if (commentlist.length < this.pager.pageSize) {
      this.pager.lock();//没有下一页，锁住分页，不进行下一页   
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
  bindFilterChange(e) {
    this.data.orderfield = e.detail.value
    this.data.orderform = e.detail.sort;
    this.pager.unlock();
    this.pager.refresh();
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
   * 在JSON配置，已禁用下拉刷新
   */
  onPullDownRefresh: function (e) {
    //this.pager.refresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    this.pager.next();
  },
  onPageScroll: function (e) {
    // this._scroll.scroll(e.scrollTop)
  }
})