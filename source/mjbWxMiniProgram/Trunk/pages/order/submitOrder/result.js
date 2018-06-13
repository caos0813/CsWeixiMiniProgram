/**
 *支付结果
 @dev fanyl
*/
const { getGoodsComment } = require('../../../apis/goods.js')
const { getImageUrl } = require('../../../utils/config.js');
const { pushMsgId } = require('../../../apis/pushMsg.js');
const { checkPay, prePay } = require('../../../apis/order.js');
const app = getApp()
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconSuccess: getImageUrl('pay-success'),
    iconFail: getImageUrl('pay-fail'),
    orderNo:-1,
    payStatus:1,
    payChannel:10,
    clientType:7
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderNo)
    {
      this.data.orderNo = options.orderNo;
      this.data.payStatus = options.payStatus;

    }
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
  onNavIndex()
  {
    this.mjd.switchTab('/pages/index/index')
  },
  onShowOrder()
  {
    //orderno
    this.mjd.switchTab(`/pages/order/detail/detail?orderno=${this.data.orderNo}`)
  },
  onRePay: app.mjd.preventRepeat(function (submitComplete, e) {
    let { orderNo } = this.data;

    // 创建订单
    this.mjd.showLoading('正在发起支付...');
    this.checkPay(orderNo).then((res) => {
      // 订单状态可用，进行预支付
      if (res.code == responseStatusCode.NORMAL) {
        this.mjd.showLoading('正在发起支付...');
        return this.prePay();
      } else {
        return Promise.reject(res.code);
      }
    }).then((res) => {
      // 预支付成功
      if (res.code == responseStatusCode.NORMAL) {
        return Promise.resolve(res.data.data);
      } else {
        // const msg = `payment.vue::<Function>goToPay--支付发生异常[${res.code}],没有返回支付地址--参数${JSON.stringify(payParams)}`;
        //this.captureException(msg); 埋点
        this.mjd.showToast(`系统繁忙，请稍后重试![${res.code}]`);
        return Promise.reject();
      }
    }).then(({ timeStamp, nonceStr, package: aPackage, paySign, signType }) => {
      // 发请微信支付
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: aPackage,
        signType: signType,
        paySign: paySign,
        success: () => {
          // 发送消息推ID
          this.mjd.getRequest({
            name: 'PUSH_MSG',
            isWrapSuccess: false,
            isCustomError: false,
            autoShowLoading: false,
            data: {
              bindId: aPackage,
              referenceNo: this.data.orderNo,
              businessType: 101 //101.支付成功102.订单支付倒计时103.订单已发货105.退款申请成功106.退货申请成功107.维修申请成功108.换货申请成功109.退款申请拒绝110.退货申请拒绝111.维修申请拒绝112.换货申请拒绝1 115.取消订单退款申请成功
            }
          });
          this.setData({
            payStatus:1
          })
        },
        fail: () => {
          this.mjd.showToast('支付失败，请重试!');
        }
      });
    }).catch(function (code) {
      const msg = this.getErrMsg(code);
      if (msg != '') {
        wx.showModal({
          title: '温馨提示',
          content: msg,
          confirmText: '去查看更多商品',
          success: (res) => {
            if (res.confirm) {
              this.mjd.reLaunch('/pages/category/index')
            } else if (res.cancel) {
            }
          }
        })
      }
    }).then(submitComplete);

  }, function () {
    this.mjd.hideLoading();
  }),
  prePay() {
    return prePay({
      isWrapSuccess: false,
      isCustomError: true,    // 是否自定义错误，
      autoShowLoading: false,
      data: {
        orderId: this.data.orderId,
        orderNo: this.data.orderNo,
        payChannel: 10,// 支付渠道(1:微信,2:支付宝,3:京东,4:测试支付,5：联动微信公众号支付,6：联动H5微信支付,7：联动H5支付宝支付,8：联动APP微信支付,9联动APP支付宝支付,10:小程序微信支付
        clientType: 7, //客户端类型发起交易平台（0.未知来源平台 1.PC 2.WeiXin微信 3.Android安卓 4.IOS苹果 5.TouchScreen触屏 6.IOS审核版 7.小程序
        clientEnvironment: 0
      }
    });
  },
  checkPay(orderNo) {
    return checkPay({
      isWrapSuccess: false,
      isCustomError: true,    // 是否自定义错误，
      autoShowLoading: false,
    }, {
        orderNo
      });
  },
  getErrMsg(code) {
    let message = '';
    if (code == 3601 || code == 3603) {
      message = '订单已支付，请勿重复下单';
    } else if (code == 3602) {
      //订单已关闭
      message = '抱歉，订单支付已超时';
    } else if (code == 3610) {
      //订单不存在
      message = '抱歉，该订单发生异常，请重试';
    } else if (code == 3611) {
      //sku异常
      message = '商品库存不足，请重新下单';
    }
    return message;
  }
})