/*
商品评价列表
@dev fanyl
*/
const app = getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spuid:{
      type:Number,
      value:-1
    },
    statistics:{
      type:Object,
      value:function()
      {
        return {
          commentcount:0,
          satisfactionval:0
        }
      }
    },
    list:{
      type:Array,
      value:function(){
        return [];
      }
    },
    tempType:{
      type:Number,
      value:1
    }
  },
  attached()
  {

  },
  /**
   * 组件的初始数据
   */
  data: {
    isShowPreview:false,
    previewImages:[]
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    onNavList(e){
      if (this.data.spuid>0){
       wx.navigateTo({
         url: `/pages/goods/goodsEvaluate/goodsEvaluate?spuid=${this.data.spuid}`
       })
      }
    },
    hidePreview()
    {
      this.setData({
        isShowPreview:false,
        previewImages: []
      })
    },
    onPreviewImage(e){
        let {index,url}=e.currentTarget.dataset;
        let { piclist} = this.data.list[index];
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: piclist // 需要预览的图片http链接列表
        })
    },
    onSwiperImageChange(){

    },
    onExpand(e)
    {
      let { index } = e.currentTarget.dataset, status = this.data.list[index].expandStatus; 
      this.setData({
        [`list[${index}].expandStatus`]:status == 1 ? 2 : 1
      })
    }
  }
})
