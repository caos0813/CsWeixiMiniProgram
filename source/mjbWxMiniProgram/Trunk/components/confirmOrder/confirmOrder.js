// components/confirmOrder/confirmOrder.js
let app = getApp();
const wxAPI = require('../../utils/wx-api.js');
const { confirmOrder } = require('../../apis/order.js');
const { pushMsgId } = require('../../apis/pushMsg.js');

app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderno: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    }
  },

  externalClasses: ['my-class'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    confrimOrder: function(e) {
      console.log(e)
      let orderno = this.data.orderno;
      // 模板消息所需formid
      let formId = e.detail.formId;
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
              pushMsgId({
                bindId: formId,
                referenceNo: orderno,
                businessType: 104,
              }).then(res => {
                console.log(res)
              });
            });
          }
        }
      })
    }
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {},
  moved: function () {},
  detached: function () {},
})
