// pages/bind/bind.js
const { getCode, bindOpenid, login } = require('../../apis/login.js');
const wxAPI = require('../../utils/wx-api.js');
const requestExport = require('../../utils/request.js');
const COUNTDOWN_SECONDS = 120;
const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    captchaLabel: '获取验证码',
    captchaDisabled: false,
    isPhoneFocus: false,
    isCodeFocus: false,
    seconds: COUNTDOWN_SECONDS,
    openid: ''
  },

  bindPhoneInput: function(e) {
    this.setNextData({
      phone: e.detail.value
    })
  },

  bindCodeInput: function(e) {
    this.setNextData({
      code: e.detail.value
    })
  },

  clearPhone: function(e) {
    this.setNextData({
      phone: ''
    })
  },

  clearCode: function(e) {
    this.setNextData({
      code: ''
    })
  },

  phoneFocus: function() {
    this.setNextData({
      isPhoneFocus: true
    })
  },

  phoneBlur: function() {
    this.setNextData({
      isPhoneFocus: false
    })
  },

  codeFocus: function () {
    this.setNextData({
      isCodeFocus: true
    })
  },

  codeBlur: function () {
    this.setNextData({
      isCodeFocus: false
    })
  },
  
  captcha: function(e) {
    let timer;
    let seconds = this.data.seconds;
    // 如果在倒计时不让点击
    if (this.data.captchaDisabled) {
      return false;
    }
    if(!this.checkPhone()) {
      return false;
    }
    // 正在发送验证码
    this.setNextData({
      captchaDisabled: true,
      captchaLabel: '正在发送'
    });
    getCode(this.data.phone).then(res => {
      console.log(res);
      // 发送验证码成功
      timer = setInterval(() => {
        seconds--;
        this.setNextData({
          captchaLabel: `重新发送(${seconds})`,
          seconds: seconds
        });
        if (seconds === 0) {
          clearInterval(timer);
          this.resetData();
        }
      }, 1000);
    }, () => {
      console.log('fail');
    });
  },

  checkPhone: function() {
    const phoneReg = /^1\d{10}$/;
    if (!phoneReg.test(this.data.phone)) {
      wxAPI.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return false;
    }
    return true;
  },

  checkCode: function() {
    const codeReg = /^\d{6}$/;
    if (this.data.code.length < 6) {
      wxAPI.showToast({
        title: '请输入6位验证码',
        icon: 'none'
      });
      return false;
    }
    if (!codeReg.test(this.data.code)) {
      wxAPI.showToast({
        title: '请输入正确验证码',
        icon: 'none'
      });
      return false;
    }
    return true;
  },

  resetData: function() {
    this.setNextData({
      captchaDisabled: false,
      captchaLabel: '重新发送',
      seconds: COUNTDOWN_SECONDS
    });
  },

  submit: function(e) {
    if (!this.checkPhone() || !this.checkCode()) {
      return;
    }
    login({
      mobile: this.data.phone,
      smscode: this.data.code
    }).then(res => {
      console.log(res);
      wx.setStorage({
        key: "token",
        data: res.token
      });
    }, () => {
      console.log('fail');
    });
  },

  goAgreement: function() {
    wx.navigateTo({
      url: '/pages/bind/agreement',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.openid) {
      wxAPI.showToast({
        title: '不存在openid',
        icon: 'none'
      });
      return false;
    }
    this.setNextData({
      openid: options.openid
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})