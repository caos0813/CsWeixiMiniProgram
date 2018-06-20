// pages/bind/bind.js
const { getCode, login, bindWechatInfo } = require('../../apis/login.js');
const wxAPI = require('../../utils/wx-api.js');
const { getImageUrl } = require('../../utils/config.js')
const COUNTDOWN_SECONDS = 120;
const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: getImageUrl('logo'),
    phone: '',
    code: '',
    captchaLabel: '获取验证码',
    captchaDisabled: false,
    isPhoneFocus: false,
    isCodeFocus: false,
    seconds: COUNTDOWN_SECONDS
  },

  bindPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  bindCodeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  clearPhone: function(e) {
    this.setData({
      phone: ''
    })
  },

  clearCode: function(e) {
    this.setData({
      code: ''
    })
  },

  phoneFocus: function() {
    this.setData({
      isPhoneFocus: true
    })
  },

  phoneBlur: function() {
    this.setData({
      isPhoneFocus: false
    })
  },

  codeFocus: function () {
    this.setData({
      isCodeFocus: true
    })
  },

  codeBlur: function () {
    this.setData({
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
    this.setData({
      captchaDisabled: true,
      captchaLabel: '正在发送'
    });
    getCode(this.data.phone).then(res => {
      console.log(res);
      // 发送验证码成功
      timer = setInterval(() => {
        seconds--;
        this.setData({
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
    this.setData({
      captchaDisabled: false,
      captchaLabel: '重新发送',
      seconds: COUNTDOWN_SECONDS
    });
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  submit: function(e) {
    if (!this.checkPhone() || !this.checkCode()) {
      return;
    }
    let self = this;
    let wxFaceimage,
        wxNickname;
    // 能进该页面为授权状态
    // 绑定后将微信头像昵称上传作为用户头像昵称
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              wxNickname = res.userInfo.nickName;
              wxFaceimage = res.userInfo.avatarUrl;
              login({
                mobile: self.data.phone,
                smscode: self.data.code
              }).then(res => {
                app.setLoginToken(res.token);
                bindWechatInfo({
                  isWrapSuccess: false,
                  isCustomError: false,
                  autoShowLoading: true
                }, {
                    "faceimage": wxFaceimage,
                    "nickname": wxNickname
                  }).then(res => {
                    console.log(res);
                    self.goBack();
                  }).catch(err => {
                    console.log(err);
                    self.goBack();
                  });
              }, () => {
                console.log('fail');
              });
            }
          });
        }
      }
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
  
  }
})