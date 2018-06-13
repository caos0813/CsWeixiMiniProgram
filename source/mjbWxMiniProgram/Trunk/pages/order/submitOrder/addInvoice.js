/**
 *添加发票
 @dev fanyl
*/
const { saveInvoice, applyInvoice, getLastInvoiceList } = require('../../../apis/order.js')
const { getImageUrl } = require('../../../utils/config.js')
const app = getApp()
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
      orderNo:'',
      needInvoice:1,
      invinfo: 1,//	 发票信息[1 - 普通，2 - 专用 | 最后更新时间(更新时间 - 根据自定义内容开票;空-不开票;1-固定开个人发票, 特殊商品)]
      invoiceTitleType:1,// 发票抬头 1：个人 2：单位
      lastInvoiceList:[],
      personal:'',
      companyName:'',
      companyTax:'',
      mobile:'',
      email:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderNo =options.orderNo;
    let invoiceTitleType = 0, mobile='';
    if (options.hasOwnProperty('invoiceTitleType'))
    {
      invoiceTitleType =Number(options.invoiceTitleType);
    }
    if (options.hasOwnProperty('mobile')){
      mobile = options.mobile;
    }
    this.setData({
      mobile: mobile,
      needInvoice: invoiceTitleType==0?1:2,
      invoiceTitleType: invoiceTitleType == 0 ? 1 : invoiceTitleType
    });
    this.getLastInvoice().then(()=>{
      this.fillFormData();
    });
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
  checkTaxIDentifier(tax) {
    let err = '';
    let regArr = [/^[\da-z]{10,15}$/i, /^\d{6}[\da-z]{10,12}$/i, /^[a-z]\d{6}[\da-z]{9,11}$/i, /^[a-z]{2}\d{6}[\da-z]{8,10}$/i, /^\d{14}[\dx][\da-z]{4,5}$/i, /^\d{17}[\dx][\da-z]{1,2}$/i, /^[a-z]\d{14}[\dx][\da-z]{3,4}$/i, /^[a-z]\d{17}[\dx][\da-z]{0,1}$/i, /^[\d]{6}[\da-z]{13,14}$/i];
    if (tax == '') {
      err = '请输入纳税人识别号';
    } else {
      err = regArr.some(re => re.test(tax)) ? '' : '纳税人识别号格式错误';
    }
    return err;
  },
  onSubmit: app.mjd.preventRepeat(function(submitComplete,e)
  {
    let formData = e.detail.value, { orderNo, invoiceTitleType, needInvoice} = this.data;
    if(needInvoice==1)
    {
      this.setPageReturnValue();
      this.mjd.navigateBack();
      submitComplete();
      return;
    }
    let { mobile, email } = formData, companyName = '', companyTax='',msg='';
    const telRE = /^\d{11}$/;
    const emailRE = /[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (invoiceTitleType==1){
      companyName = formData.personal;
    }else{
      companyName = formData.companyName;
      companyTax = formData.companyTax;
    }
    if(companyName==''){
      msg = invoiceTitleType == 1 ? '请输入个人名称' :'请输入企业名称';
    }
    else if (invoiceTitleType==1) {
      msg = companyName.indexOf('公司') > -1 ? '个人名称中不能包含公司' : '';
    }
    else if (invoiceTitleType == 2) {
      msg = this.checkTaxIDentifier(companyTax);
    }

    if (!telRE.test(mobile)) {
      msg = '请输入正确的手机号码';
    } else if (email && !emailRE.test(email)) {
      msg = '请输入正确的电子邮箱';
    }
    if(msg!=''){
      this.mjd.showToast(msg);
      return;
    }
    //如果没有订单号就保存发票信息，否则先保存再开票
    let saveFormData={
      "invoiceType": 1,//发票类型(1-普通，2-专用) ,
      "invoiceTitleType": invoiceTitleType, //发票抬头类型(1-个人，2-单位) ,
      "invoiceContentType": 1,//发票内容类型(1-商品明细，其它待定) ,
      "mobile": mobile,//Mobile(string): 手机号(必填)
      "email": email,
      "companyName": companyName,
      "companyTax": companyTax
    }
    if (!orderNo){
      this.saveCartInvoice('保存中...', saveFormData).then((res)=>{
        if (res && res.data){
          this.setPageReturnValue();
          this.mjd.navigateBack();
        }
      }).catch(()=>{}).then(submitComplete)
    }else{
      this.openOrderInvoice(orderNo, saveFormData).then(res=>{
        if (res.code !== this.mjd.responseStatusCode.NORMAL) {
          this.mjd.showToast({ title: `申请开票失败.[${res.code}]`, icon: 'none' });
        } else {
          this.setPageReturnValue();
          this.mjd.showToast({ title: `申请开票成功`, icon: 'success' });
          setTimeout(this.redirectToOrderDetail.bind(this), 1500);
        }
      }).catch((e) => { 
      }).then(submitComplete);
    }
  }),
  setPageReturnValue()
  {
    let invoiceTitleType = this.data.invoiceTitleType;
    this.setPageStorageData({
      invinfo: this.data.invinfo,
      invoiceTitleType: this.data.needInvoice == 1 ? 0 : invoiceTitleType
    })
  },
  saveCartInvoice(showLoadingText,data){
    return saveInvoice({
      showLoadingText: showLoadingText,
      autoShowLoading: true,
      isCustomError: false,
      isWrapSuccess: false
    }, data).then((res) => {
        if (res.code !== this.mjd.responseStatusCode.NORMAL) {
          this.mjd.showToast(`${res.message}.[${res.code}]`);
          return;
        }		
        return res;
      }, () => {
        wx.showToast({ title:'请求失败', icon: 'none' });
        return Promise.reject({});
    });
  },
  //用于已生成的订单，申请开票, 需要先保存发票
  openOrderInvoice(orderNo, data) {

    return this.saveCartInvoice('申请中...', data).then((res) => {
      let transArr = [NaN, 10, 1];
      data.orderNo = orderNo;
      //因为erp数据库不一致的原因，需要转换数据
      //invoiceFormData.invoicetitletype 等于 1 时， 转为为 10，
      //invoiceFormData.invoicetitletype 等于 2 时， 转为为 1，
      data.invoiceTitleType = transArr[this.data.invoiceTitleType];
      return applyInvoice({
        isWrapSuccess: false,
        isCustomError: true,    // 是否自定义错误，
        autoShowLoading: false,
      },data);
    });	
  },
  redirectToOrderDetail() {
    this.mjd.navigateBack();
  },
  fillFormData() {
    let { lastInvoiceList, invoiceTitleType}=this.data;
    let invoiceData  =lastInvoiceList.find(item => item.invoicetitletype == invoiceTitleType)
    if (!invoiceData)
    {
      return;
    }
    this.mobile = invoiceData.mobile;
    this.email = invoiceData.email;

    this.setData({
      personal: invoiceTitleType == 1 ? invoiceData.companyName || '个人' : '',
      companyName: invoiceData.companyname,
      companyTax: invoiceData.companytax,
      mobile: invoiceData.mobile,
      email: invoiceData.email
    })
  },
  getLastInvoice() {
    return getLastInvoiceList({
      autoShowLoading: false,
      isCustomError: true,
      isWrapSuccess: true
    },0).then(data => {
      this.data.lastInvoiceList =data;
    },()=>{
      return Promise.reject();
    });
  },
  onNeedInvoice(e) {
    let dataset = e.target.dataset;
    if (dataset.value) {
      this.setData({ needInvoice: dataset.value})
    }

  },
  onInvoiceTitleType(e){
    let dataset=e.target.dataset;
    if (dataset.value){
      this.setData({ invoiceTitleType: dataset.value});
      this.fillFormData();

    }

  }
})