// components/filterBar/filterBar.js

const app=getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    filterBar: { // 属性名
      type: Array,
      value: [5, 4, 3, 1], //5：新品优先 4：综合 3：销量 1:价格
      observer: function (newVal, oldVal) {} 
    },
    isStatic:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _prevCount:0,
    _defaultSort:{
      '5':2,
      '4':2,
      '3':2,
      '1':2
    },
    _count:0,
    index: 0,
    isAsc:true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 选项改变事件
    change:function(e){
      let { index, value } = e.target.dataset, that = this, count = that.data._count, sort = this.data._defaultSort[value];
      index = Number(index) - 1;
      if(index==3){
        this.data._prevCount=count;
        sort = count++%2+1;
        this.data.isAsc = sort == 1;
        this.data._count = count;
      }else{
        this.data._count = this.data._prevCount;
      }
      
      that.setNextData({
        index: index,
        isAsc: this.data.isAsc
      });
      that.triggerEvent('change', { value: value,sort:sort }, { bubbles: false, composed: false })
    }
  }
})