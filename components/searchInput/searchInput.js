/*
搜索输入框
@dev fanyl
*/
const app = getApp()
// components/searchInput/searchInput.js
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: Number,
      value: 13
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFocus(e) {
      app.mjd.navigateTo('/pages/search/search');
    }
  }
})
