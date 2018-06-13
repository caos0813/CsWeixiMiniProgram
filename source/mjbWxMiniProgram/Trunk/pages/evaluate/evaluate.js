// pages/evaluate/evaluate.js
const {
  getPendingCommentList,
  getCommentList
} = require('../../apis/evaluate.js');
const wxAPI = require('../../utils/wx-api.js');

const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 1, // 待评价：1，已评价：2
    isEvaluated: false, // 是否是已评价选项卡 待评价：false，已评价：true
    pendindCommentList: [], // 待评价列表
    commentList: [], // 已评价列表
    loading: 0
  },

  /**
   * 
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
        this.data.pendindCommentList = []; // 请求之前先清空数组
        this.data.commentList = [];
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
      // 待评价
      this.getPendingCommentList().then(list => {
        // 没有数据，显示空
        if (list.length <= 0) {
          this.setNextData({
            isShow: false
          });
        } else {
          this.setNextData({
            pendindCommentList: list,
            isShow: true
          });
          this.showLoadMore(list)
        }
      })
      // 已评价
      this.getCommentList().then(list => {
        // 没有数据，显示空
        if (list.length <= 0) {
          this.setNextData({
            isShow: false
          });
        } else {
          this.setNextData({
            commentList: list,
            isShow: true
          });
          this.showLoadMore(list)
        }
      })
    })
    // 上拉加载下一页时
    this.pager.on('next', () => {
      // 请求之前，显示加载效果
      this.setNextData({
        loading: 1
      });
      if (that.data.index == 1) {
        this.getPendingCommentList(false).then(list => {
          // 追加数据到列表中
          if (list.length > 0) {
            this.data.pendingCommentList.push(...list);
            this.setNextData({
              pendingCommentList: this.data.pendingCommentList
            });
          }
          this.showLoadMore(list)
        })
      } else {
        this.getCommentList(false).then(list => {
          // 追加数据到列表中
          if (list.length > 0) {
            this.data.commentList.push(...list);
            this.setNextData({
              commentList: this.data.commentList
            });
          }
          this.showLoadMore(list)
        })
      }
    })
    this.pager.read();
  },
  // 待评价请求  写一个方法，调接口时判断当前选中状态
  getPendingCommentList: function (autoShowLoading = true) {
    return getPendingCommentList({
      pageindex: this.pager.pageIndex
    }, autoShowLoading);
  },
  // 已评价请求
  getCommentList: function (autoShowLoading = true) {
    return getCommentList({
      pageindex: this.pager.pageIndex
    }, autoShowLoading);
  },
  showLoadMore(list) {
    // 如果结果集长度小于当前页大小，代表数据读到最后一页了
    if (list.length < this.pager.pageSize) {
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
  // 立即评价
  onNowEval(e) {
    let goodsInfo = e.target.dataset.info;
    console.log(goodsInfo);
    wx.navigateTo({
      url: '/pages/evaluate/nowEvaluate?goodsInfo=' + JSON.stringify(goodsInfo),
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  evalTitleChange(e) {
    let index = Number(e.target.dataset.index), isEvaluated = this.data.isEvaluated;
    index == 1 ? isEvaluated = false : isEvaluated = true;
    this.setData({ index: index, isEvaluated: isEvaluated });

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