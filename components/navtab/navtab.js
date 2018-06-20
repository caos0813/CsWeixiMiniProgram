/*
tab 切换
@dev fanyl
*/
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
  },
  ready(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showTab(index){
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
