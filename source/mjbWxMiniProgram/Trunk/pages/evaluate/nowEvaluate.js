// pages/evaluate/nowEvaluate.js
const {
  commit_comment
} = require('../../apis/evaluate.js');
const wxAPI = require('../../utils/wx-api.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo:{},
    starsNum: 5,
    gradeList: ['差', '一般', '满意', '很满意', '非常满意'],
    text:"",
    textLen: 0,
    is_checked: true,
    filePaths: [],
    startX: 0,
    pageY: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ goodsInfo:JSON.parse(options.goodsInfo)})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 开始滑动
  onTouchstart(e) {
    if (e.target.dataset.index != undefined) {
      this.setData({
        startX: e.touches[0].pageX,
        pageY: e.touches[0].pageY,
        starsNum: e.target.dataset.index + 1
      });
    }
  },
  // 滑动中
  onTouchmove(e) {
    let that = this;
    let moveX = e.touches[0].pageX - that.data.startX;
    if (that.data.pageY > 160 && that.data.pageY < 172) {
      if (moveX > 0) {
        if (Math.ceil(moveX / 20) > 5) {
          that.data.starsNum = 5;
        } else {
          that.data.starsNum = Math.ceil(moveX / 20);
        }
      } else {
        let x = that.data.startX - e.touches[0].pageX;
        if (Math.ceil(x / 20) >= 5) {
          that.data.starsNum = 1;
        } else {
          that.data.starsNum = 5 - Math.ceil(x / 20);
        }
      }
      that.setData({ starsNum: that.data.starsNum });
    }
  },
  // 输入评论事件
  onInput(e) {
    this.setData({ textLen: e.detail.value.length });
  },
  // 匿名评价
  checkClick(e) {
    this.data.is_checked ? this.setData({ is_checked: false }) : this.setData({ is_checked: true });
  },
  // 添加图片
  addCamera() {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePaths = that.data.filePaths;
        res.tempFilePaths.map((i, i_index, i_arr) => {
          if (that.data.filePaths.length < 9) {
            filePaths.push(i);
          }
        });
        that.setData({ filePaths: filePaths });
      }
    })
  },
  // 删除图片
  onClearIcon(e) {
    let index = Number(e.target.dataset.index), that = this;
    that.data.filePaths.splice(index, 1);
    this.setData({ filePaths: that.data.filePaths })
  },
  // 提交评论
  onSubmit(){
    var that =this,data=that.data;
    let anonymity = data.is_checked?0:1, orderlineid = data.goodsInfo.orderlineid, picturename = data.filePaths, stars = data.starsNum, text = data.text;
    console.log(anonymity);
    console.log(orderlineid);
    commit_comment(anonymity,orderlineid,picturename,stars,text).then(list => {
      
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