// components/empty/emptyGood.js
const { getImageUrl } = require('../../utils/config.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    emptyImage:{
      type:String,
      value: getImageUrl('empty')
    },
    text:{
      type:String,
      value:'抱歉，没有找到相关商品'
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    emptyImage: getImageUrl('empty'),
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
