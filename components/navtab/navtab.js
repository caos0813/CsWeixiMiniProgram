// components/navtab/navtab.js
const app = getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentIndex:{
      type:Number,
      value:0,
      observer(index){
        this.showTab(index);
      }
    },
    tabs:{
      type:Array,
      value:function(){
        return [];
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data:{
    tabInfo: [],
    animationData:{}
  },
  ready(){
    var tabInfo = this.data.tabInfo;
    if (tabInfo.length<=0)
    {
      var query = this.createSelectorQuery().in(this);
      var linePos = query.select('#linepos');
      query.selectAll('.tab-item').fields({ size: true, rect:true},r=>{
        this.data.tabInfo=r.slice();
        this.moveLinePos();
      }).exec()
    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    moveLinePos:function(){
      let tabInfo = this.data.tabInfo;
      let index = this.data.currentIndex;
      let _linePos = this.data._linePos;
      if (index < tabInfo.length){
        let lineWidth = tabInfo[index].width*0.5;
        let {width,left}=tabInfo[index];
        let offsetX = left+(width - lineWidth) / 2 ;  
        if (!this.animation){
          let animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 500,
            timingFunction: "ease",
            delay: 0
          })
        this.animation = animation
        }
       this.animation.width(lineWidth).left(offsetX).step();
        this.setData({
          animationData: this.animation.export()
        })
      }
    },
    showTab(index){
      this.moveLinePos();
      this.triggerEvent('change', { index: index }) // 只会触发 pageEventListener2
    },
    bindTap(e){
      let index = e.currentTarget.dataset.index;
      this.setData({
        currentIndex: index
      });
    }
  }
})
