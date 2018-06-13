/*
星级评分
@dev fanyl
*/
const app = getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
      value:{
        type:Number,
        value:5
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
    canvasIdErrorCallback(){
      console.log('error');
    },

      showStar()
      {      
          var r = 8,r2=r/2,
            inner = 54/180*Math.PI,
            outer = 18 / 180 * Math.PI,
            value = this.data.value, ctx = this._starctx, interval = 10, x = r, y = r, pi = Math.PI * 2 / 5 ;
          for(let n=0;n<5;n++){
              ctx.beginPath();
              ctx.setFillStyle(n < value ? '#FF681D' : '#CCCCCC');
              for(let i=0;i<5;i++)
              {
                let radian = pi * i + 0.6108652381980153;
                let x2=x;
                let y2=y;     
                ctx.lineTo(x2 + r * Math.cos(radian + outer), y2 + r * Math.sin(radian + outer));
                ctx.lineTo(x2 + r2 * Math.cos(radian + inner), y2 + r2 * Math.sin(radian + inner));
              }
              x+=r*2+5;
              ctx.fill();
       
          }
          ctx.draw();
      }
  },
  ready()
  {
    var context = wx.createCanvasContext('canvas',this)
    this._starctx = context;
    this.showStar();
  }
})
