/**
 *提交订单
 @dev fanyl
*/
const { pushMsgId } = require('../../../apis/pushMsg.js')
const { createOrder, checkPay, prePay } = require('../../../apis/order.js')
const { getAddressList } = require('../../../apis/address.js')
const { getImageUrl } = require('../../../utils/config.js')
const { getCartList } = require('../../../utils/cart-list.js')
const app = getApp()
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
      orderId:-1,
      orderNo:-1,
      invinfo:1,
      invoiceType: 0,
      orderInfo:{
        goodstotalprice:0,//,(number, optional): 商品总价值 ,
        goodsdistotalamount:0,//(number, optional): 商品折扣总金额 ,
        shippingfee:0,//(number, optional): 运费 ,
        orderdistotalamount:0,//(number, optional): 订单折扣总金额 ,
        orderamount:0,//(number, optional): 订单总价值 ,
        orderdueamount:0,//(number, optional): 订单应付金额 ,
        goodsnum:0,//(integer, optional): 购物车商品数量 
        list:[],
      },
      addressList:[],
      addressInfo:{
        address_id: 0,
        user_id: 0,
        contact_name: '',
        mobile: '',
        telephone: '',
        areaaid: 0,
        areabid: 0,
        areacid: 0,
        areadid: 0,
        areaAName: '',
        areaBName: '',
        areaCName: '',
        areaDName: '',
        address_detail: '',
        zip: '',
        address_flag: 0,
        default_flag: 0,
        label_name: ''
      },
      dialog:{
        visibleDialog:false,
        title:'',
        content:'',
        list:[],
        buttons: [{
          text: '取消',
          color: '#FF681D',
          value: 1
        }, {
          text: '确定',
          color: '#666666',
          value: 2
        }]
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showCartList();
    this.showAddress();
  },
  showCartList()
  {
    getCartList((orderInfo)=>{
      if (!this.mjd.isPlainObject(orderInfo)){
        return;
      }
      this.setData({
        orderInfo
      })
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
  onShow: function (options) {
    if (options.hasOwnProperty('invoiceTitleType')){
      this.setData({
        invoiceType: Number(options.invoiceTitleType)
      })
    }
    if (options.hasOwnProperty('address')) {
      this.setData({
        addressInfo: options.address
      })
    }
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
  addInvoice()
  {
    this.mjd.navigateTo(`/pages/order/submitOrder/addInvoice?invoiceTitleType=${this.data.invoiceType}&mobile=${this.data.addressInfo.mobile}`)
  },
  showAddress()
  {

    getAddressList().then((addressList) => {
      this.setData({ addressList});
      this.setDefaultAddress();
    })
  },
  setDefaultAddress()
  {
    let addressList = this.data.addressList;
    let addrId =0;
    if (addressList.length === 0) {
      return;
    }
    let addressInfo=null;
    if (addrId) {
      addressInfo = addressList.find(addr => addr.address_id == addrId);
    } else {
      addressInfo = addressList.find(addr => addr.default_flag == 1);
    }
    if (addressInfo){
      this.setData({
        addressInfo: addressInfo
      })
    }
   
  },
  onSubmitOrder: app.mjd.preventRepeat(function(submitComplete,e){
    let { addressInfo, invinfo } = this.data, { formId}=e.detail;
    let goodsList = this.data.orderInfo.list;
    let goodsData = goodsList.map(d=>{
      return {
        skuid: d.skuid,
        note: ''
      }
    }), responseStatusCode = this.mjd.responseStatusCode;

    let msg='';
    if (goodsData.length <= 0) {
      msg='没有商品哦'
    } else if (addressInfo.address_id <= 0) {
      msg = '请选择收货地址'
    }
    if (msg!=''){
      this.mjd.showToast(msg);
      submitComplete();
      return;
    }

    // 创建订单
    this.mjd.showLoading('正在提交中...');
    createOrder(addressInfo.address_id, invinfo,{
      data: goodsData,
      isWrapSuccess:false,
      isCustomError: false,    // 是否自定义错误，
      autoShowLoading: false
    }).then((res)=>{
      return new Promise((resolve,reject)=>{
        const code = res.code;
        // 创建成功，检查支付状态
        if (code == responseStatusCode.NORMAL) {
          // 发送消息推ID
          this.mjd.getRequest({
            name:'PUSH_MSG',
            isWrapSuccess:false,
            isCustomError:false,
            autoShowLoading:false,
            data:{
              bindId: formId,
              referenceNo: res.data.orderNo,
              businessType: 102
          }}).then(()=>{
            resolve(res.data);
            }, reject);
          return;
        } else if (code == responseStatusCode.NO_GOODS_ADDR) {
          this.showPopup('以下商品，在您所选区域配送不到', '返回购物车',1, '修改地址',2, res.data.failedgoods);    
        } else if (/^(3313|3314|3315)$/.test(code)) {
          this.showPopup('亲，商品太热销了，库存不足了', '返回购物车',1, '确定',0, res.data.failedgoods);
        } else if (code == 3402) {
          this.mjd.showToast('发票有更新，请重新确认');
        } else {
          this.mjd.showToast(`系统繁忙，请稍后重试![${code}]`);
        }
        reject();      
      });
    },(message)=>{
      this.mjd.showToast(message||'创建订单失败');
      return Promise.reject();
   }).then(({ orderId, orderNo, orderAmount})=>{
      // 检查支付状态
     this.data.orderId = orderId;
     this.data.orderNo = orderNo;
     return this.checkPay(orderNo);
   }).then((res)=>{
      // 订单状态可用，进行预支付
      if (res.code == responseStatusCode.NORMAL) {
        this.mjd.showLoading('正在发起支付...');
        return this.prePay();
      } else {
        return Promise.reject(res.code);
      }
    }).then((res)=>{
      // 预支付成功
      if (res.code == responseStatusCode.NORMAL) {
         return Promise.resolve(res.data.data);
      } else {
       // const msg = `payment.vue::<Function>goToPay--支付发生异常[${res.code}],没有返回支付地址--参数${JSON.stringify(payParams)}`;
        //this.captureException(msg); 埋点
        this.mjd.showToast(`系统繁忙，请稍后重试![${res.code}]`);
        return Promise.reject();
      }
      }).then(({ timeStamp, nonceStr, package:aPackage, paySign, signType })=>{
    
     // 发请微信支付
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: aPackage,
        signType: signType,
        paySign: paySign,
        success:()=>{
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
          this.mjd.redirectTo(`/pages/order/submitOrder/result?payStatus=1&orderNo=${this.data.orderNo}`)
        },
        fail:()=>{
          this.mjd.redirectTo(`/pages/order/submitOrder/result?payStatus=0&orderNo=${this.data.orderNo}`)
        }
      });
    }).catch(function (code){
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

  },function(){
    this.mjd.hideLoading();
  }),
  prePay()
  {
    return prePay({
      isWrapSuccess: false,
      isCustomError: true,    // 是否自定义错误，
      autoShowLoading: false,
      data:{
         orderId: this.data.orderId,
         orderNo: this.data.orderNo ,
         payChannel: 10,// 支付渠道(1:微信,2:支付宝,3:京东,4:测试支付,5：联动微信公众号支付,6：联动H5微信支付,7：联动H5支付宝支付,8：联动APP微信支付,9联动APP支付宝支付,10:小程序微信支付
         clientType: 7, //客户端类型发起交易平台（0.未知来源平台 1.PC 2.WeiXin微信 3.Android安卓 4.IOS苹果 5.TouchScreen触屏 6.IOS审核版 7.小程序
         clientEnvironment:0
      }
    });
  },
  checkPay(orderNo)
  {
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
  },
  onSelectAddress(e){
    this.mjd.navigateTo('/pages/address/selManager')
  },
  editAddress(e)
  {
    let {id}=e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/address/selManager?address_id=${id}`
    })
  },
  showPopup(content,leftBtn,lvalue,RightBtn,rvalue,list)
  {
    this.setData({
      dialog:{
        visibleDialog: true,
        title: '',
        confirmText: RightBtn,
        cancelText: leftBtn,
        list: list,
        buttons: [{
          text: leftBtn,
          color: '#FF681D',
          value: lvalue
        }, {
            text: RightBtn,
          color: '#666666',
          value: rvalue
        }]
      }
    })
  },
  onDialogChange(e){
    let { value} = e.detail;
    if(value==1){
      wx.navigateBack({
        delta: (1),
      })
    }else if(value==2){
      this.mjd.navigateTo('/pages/address/newAddress?id=${}')
    }
  }
})