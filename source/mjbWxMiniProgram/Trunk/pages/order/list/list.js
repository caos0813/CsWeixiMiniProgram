// pages/order/list/list.js
const app = getApp();
const wxAPI = require('../../../utils/wx-api.js');
const { setCartList } = require('../../../utils/cart-list.js');
const { getList, confirmOrder, cancelOrder } = require('../../../apis/order.js');

app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [
      {
        'text': '全部',
        'status': 0
      },
      {
        'text': '待付款',
        'status': 1
      },
      {
        'text': '待发货',
        'status': 10
      },
      {
        'text': '待收货',
        'status': 20
      },
      {
        'text': '已完成',
        'status': 30
      }
    ],
    curStatus: 0,
    activeIndex: 0,
    list: [],
    countDownList: [],
    isLoading: false,
    loaded: false,
    noOrder: false
  },
  
  changeActive: function(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      activeIndex: status,
      curStatus: status
    });
    this.dataReset();
    this.showData(status);
  },

  confirmOrderFn: function (e) {
    let that = this;
    let orderno = e.currentTarget.dataset.orderno;
    wx.showModal({
      content: '确认收到商品吗？操作不可逆转',
      cancelText: '再想一想',
      confirmText: '确认收货',
      success: function (res) {
        if (res.confirm) {
          confirmOrder({
            orderno: orderno
          }).then(res => {
            wxAPI.showToast({
              title: '确认收货成功',
              duration: 2000
            });
            that.init();
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activeIndex: options.status,
      curStatus: options.status
    });
    var that = this;
    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    });
    this.pager.setTotal(9999999999999);// 接口未返回总记录数，设置
    // 页变化
    this.pager.onPageChange(function (pageIndex) {
      // 切换tab时会重复请求 pageIndex=1返回
      if(pageIndex === 1) {
        return false;
      }
      that.showData(that.data.curStatus, false)
    });
    // 页数发生变化
    this.pager.onPageCountChange(function () {
      console.log(this.pageCount, this.pageIndex);
    });
  },
  init: function() {
    this.showData(this.data.curStatus);
  },
  showData: function (status=0, autoShowLoading = true) {
    return getList({
      status: status,
      pageindex: this.pager.pageIndex
    }, autoShowLoading).then(list => {
      list = list.list;
      this.setData({
        isLoading: false
      });
      if (list.length > 0) {
        this.data.list.push(...list);
        this.setData({
          list: this.data.list
        });
      }
      if(list.length === 0 && this.data.list.length === 0) {
        this.setData({
          noOrder: true
        })
      }
      // 倒计时
      for(var i=0; i<list.length; i++) {
        // 因为待付款不一定排序在列表最前面，去掉大于0限制
        // if (list[i].paymentendtime > 0) {
          this.data.countDownList.push(list[i].paymentendtime);
        // }
      }
      this.setData({
        countDownList: this.data.countDownList
      });

      if (list.length < this.pager.pageSize) {
        this.setData({
          loaded: true
        });
        this.pager.lock();//当没有数据了，代表没有下一页，锁住分页，不进行下一页
      }
      this.countDown();
    })
  },

  countDown: function() {
    let countDownList = this.data.countDownList;
    let that = this;
    // 如果没有订单或者订单中所有待倒计时值为0则return
    let noWiatPay = countDownList.every((cur) => {
      return cur === 0
    });
    if(countDownList.length === 0 || noWiatPay) {
      return false;
    }
    let timer = setInterval(() => {
      for (var i = 0; i < countDownList.length; i++) {
        if (countDownList[i] > 0) {
          countDownList[i]--;
        }else {
          if (that.data.list[i].status == 1) {
            // 倒计时结束取消该订单，并重新load数据
            clearInterval(timer);
            cancelOrder({
              orderno: that.data.list[i].orderno,
              closeType: 0
            }).then(res => {
              that.init();
            })
          }
        }
      }
      this.setData({
        countDownList: countDownList
      })
    }, 1000);
  },

  dataReset: function() {
    this.setData({
      list: [],
      countDownList: [],
      isLoading: false,
      loaded: false,
      noOrder: false
    });
    this.pager.unlock();
    this.pager.refresh();
  },

  // 再次购买
  reBuy: function(e) {
    let idx = e.currentTarget.dataset.idx;
    let reBuyData = [];
    let linesData = this.data.list;
    for(let i=0; i<linesData[idx].lines.length; i++) {
      reBuyData.push({
        'shopnum': linesData[idx].lines[i].qty,
        'skuid': linesData[idx].lines[i].skuid,
        'goodsprice': linesData[idx].lines[i].salesprice,
        'isselect': true
      })
    }
    setCartList(reBuyData);
    wx.switchTab({
      url: '/pages/cart/cartList',
    })
  },

  // 查看物流
  goLogisticsPage: function(e) {

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
    // 左上角返回 如果在详情页确认收货，列表页需要实时更新
    this.dataReset();
    this.init();
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