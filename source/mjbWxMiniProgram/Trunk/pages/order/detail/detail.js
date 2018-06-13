// pages/order/detail/detail.js
const app = getApp();
const wxAPI = require('../../../utils/wx-api.js');
const { setCartList } = require('../../../utils/cart-list.js');
const { getDetail, getExpress, confirmOrder, cancelOrder } = require('../../../apis/order.js');

app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataIsLoaded: false,
    detail: {},
    expressSteps: {},
    reBuyData: [],
    paymentendtime: 0,
    shipmentId: '',
    expressNo: '',
    stateText: {
      1: {
        txt: '订单已提交，剩余付款时间',
        class: 'state-wait-pay'
      },
      10: {
        txt: '订单已接收，将尽快发货～',
        class: 'state-wait-deliver'
      },
      20: {
        txt: '订单已发货，请注意查收～',
        class: 'state-wait-receive'
      },
      30: {
        txt: '订单已完成，欢迎再次购买～',
        class: 'state-completed'
      },
      40: {
        txt: '急速退款确认中～',
        class: 'state-refunding'
      },
      50: {
        txt: '',
        class: 'state-closed'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options.orderno);
  },

  getDetailFn: function(orderno) {
    return getDetail(orderno).then((res) => {
      this.setData({
        detail: res,
        dataIsLoaded: true
      });
      // 如果是已关闭
      if(res.status == 50) {
        let tips = '';
        if(res.cancelordertype == 1) {
          tips = '超时未支付，订单自动关闭~'
        }else if(res.cancelordertype == 20) {
          tips = '订单已关闭~'
        }else {
          tips = '已退款，订单关闭~'
        }
        let stateText50txt = 'stateText.50.txt';
        this.setData({
          [stateText50txt]: tips
        })
      }
      // 待付款
      if(res.status == 1) {
        this.setData({
          paymentendtime: res.paymentendtime
        });
        this.countDown();
      }
      // 如果可以再次购买 跳转购物车数据
      if(res.status == 30 || res.status == 50) {
        let reBuyData = [];
        for(var i=0; i<res.lines.length; i++) {
          reBuyData.push({
            'shopnum': res.lines[i].qty,
            'skuid': res.lines[i].skuid,
            'goodsprice': res.lines[i].salesprice,
            'isselect': true
          })
        }
        this.setData({
          reBuyData: reBuyData
        });
      }

      return res.expressnoitems;
    })
  },
  getExpressFn: function(res) {
    if (!res || res.length == 0) {
      return;
    }	
    let exp = res[0];
    this.setData({
      shipmentId: exp.shipmentid,
      expressNo: exp.expressno
    });
    return getExpress({
      shipmentId: exp.shipmentid, 
      expressNo: exp.expressno
    });
  },
  init: function(orderno) {
    this.getDetailFn(orderno)
      .then(this.getExpressFn)
      .then((res) => {
        if(!res) {
          return false;
        }
        let steps = res.steps;
        if (steps.length === 0) {
          if(this.data.detail.status == 30) {
            // 已完成
            this.setData({
              expressSteps: {
                content: '您的订单已签收，感谢您在满金店购物，欢迎再次光临。',
                starttime: this.data.detail.confirmedtime
              }
            })
          }else {
            this.setData({
              expressSteps: {
                content: '暂无物流信息'
              }
            })
          }
        } else {
          this.setData({
            expressSteps: steps[0]
          })
        }
      })
  },

  confirmOrderFn: function() {
    let that = this;
    wx.showModal({
      content: '确认收到商品吗？操作不可逆转',
      cancelText: '再想一想',
      confirmText: '确认收货',
      success: function(res) {
        if(res.confirm) {
          confirmOrder({
            orderno: that.data.detail.orderno
          }).then(res => {
            console.log(res);
            wxAPI.showToast({
              title: '确认收货成功',
              duration: 2000
            });
            that.init(options.orderno);
          })
        }
      }
    })
  },
  cancelOrderFn: function() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      cancelText: '取消',
      confirmText: '确认',
      success: function (res) {
        if(res.confirm) {
          cancelOrder({
            orderno: that.data.detail.orderno,
            closeType: 0
          }).then(res => {
            console.log(res);
            that.init(that.data.detail.orderno);
          })
        }
      }
    })
  },

  countDown: function() {
    let timer = setInterval(() => {
      this.data.paymentendtime--;
      this.setData({
        paymentendtime: this.data.paymentendtime
      });
      if(this.data.paymentendtime == 0) {
        clearInterval(timer);
        this.init(this.data.detail.orderno);
      }
    }, 1000);
  },

  // 查看物流
  goLogisticsPage: function() {
    wx.navigateTo({
      url: `/pages/logistics/logistics?shipmentId=${this.data.shipmentId}&expressNo=${this.data.expressNo}`,
    });
  },

  // 再次购买
  reBuy: function() {
    setCartList(this.data.reBuyData);
    wx.switchTab({
      url: '/pages/cart/cartList',
    })
  },

  // 申请售后
  applyAftersale: function() {
    
  },

  // 申请开票
  applyInvoice: function() {

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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})