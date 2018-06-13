/*
对话框
@dev fanyl
*/
const app = getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible:{
      type: Boolean,
      value: false,
      observer(value) {
        this.showDialog(value);
      }
    },
    title:{
      type: String,
      value: '温馨提示'
    },
    buttons:{
      type:Array,
      value: [{
        text: '取消',
        color: '#FF681D',
        value: 1
      }, {
        text: '确定',
        color: '#666666',
        value: 2
      }]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visibleDialog:false
  },
  attached()
  {
    this.showDialog(this.data.visible)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showDialog(visible)
    {
      if(!visible){
        this.triggerEvent('close') 
      }else{
        this.triggerEvent('open')
      }
      this.setData({
        visibleDialog: visible
      })
    },
    hide()
    {
      this.showDialog(false);
    },
    show()
    {
      this.showDialog(true);
    },
    onConfirm(e){
        let { value } = e.currentTarget.dataset;
        if (value==0){
          this.hide();
        } 
        this.triggerEvent('change', { value}) 
    }
  }
})
