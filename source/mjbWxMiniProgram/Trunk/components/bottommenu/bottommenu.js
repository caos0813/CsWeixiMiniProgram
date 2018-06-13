/*
底部菜单弹出窗
@dev fanyl
*/
const { getImageUrl } = require('../../utils/config.js')
const app = getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible:{
      type:Boolean,
      value:false,
      observer(value) {
        this.showMenu(value);
      }
    },
    buttons:{
      type:Array,
      value:[],
      observer(value) {
        this.setData({
          buttons: value
        })
      }
    }
  },
  ready(){
   // this.showMenu(this.data.visible)
  },
  /**
   * 组件的初始数据
   */
  data: {
    visiblemenu:false,
    visibleClass: ' hide',
    closeIcon: getImageUrl('goods-close')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindtransitionend(){
      if (!this.data.visible ){
      this.setData({
        visibleClass: ' hide'
      });
      }
    },
    onTap(e){
        let {index,value}=e.currentTarget.dataset;
        let info = this.data.buttons[index];
        if (info.disabled)
        {
          return;
        }
        this.triggerEvent('change', { index,value}) // 只会触发 pageEventListener2
    },
    showMenu(visible){
      let visibleClass = this.data.visibleClass;
      if (visible){
        this.setData({
          visibleClass: ' '
        },()=>{
          setTimeout(()=>{
            this.setData({
              visibleClass: ' bounceUp'
            });
          },17)
        });    
      }else{
        this.setData({
          visibleClass: ''
        });
      }
    },
    onClose(e){
      this.setData({
        visible:false
      })
    }
  }
})
