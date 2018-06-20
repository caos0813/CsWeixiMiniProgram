/**商品列表*/
let app = getApp();

app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsArr: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShowDetail(e){
      let {spuid}=e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/goods/goodsDetail/goodsDetail?spuid=${spuid}`
      })
    }
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
  },
  moved: function () { },
  detached: function () { },
})
