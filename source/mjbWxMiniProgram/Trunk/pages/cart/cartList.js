// pages/cart/cartList.js

const { postCartList, updateCartListSelect, updateCartListNum } = require('../../apis/cart.js');
const app = getApp();

app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    defaultX: 0,
    startX: 0,
    move: 0,
    allSelect: false,
    selectPiece: 0,
    allPrice: 0,
    cartNum: 0,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let getToken = wx.getStorageSync('token');
    let cartlist = wx.getStorageSync("CartList");
    
    if (getToken) {
      if (cartlist) {
        postCartList(JSON.parse(cartlist)).then(function(res){
          dataPro(res)
          wx.removeStorageSync("CartList");
        })
      } else {
        postCartList().then(function(res){
          dataPro(res)
        })
      }
    } else {
      this.setData({
        cartList: cartlist,
      })
    }

    function dataPro(res) {
      if (!res) {
        return;
      }
      res.list.map(function(v){
        v.salesprice = that.setZero(v.salesprice);
        v.left = 0;
      })
      that.setData({
        cartList: res.list
      })

      let allSelect = res.list.filter(function(v){
        return v.isselect == true
      })
  
      if (allSelect.length == res.list.length) {
        that.setData({
          allSelect: true
        })
      }
      
      that.setData({
        selectPiece: allSelect.length
      })
  
      that.totalPrice();
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  // 跳转分类页面
  goCategory: function () {
    wx.switchTab({
      url: '/pages/category/index'
    })
  },

  // 选择商品
  selectHandler: function (e){
    let idx = e.currentTarget.dataset.index;
    let list = this.data.cartList;
    if (list[idx].isselect) {
      list[idx].isselect = false;
    } else {
      list[idx].isselect = true;
    }
    let selectAll = list.filter(function(v){
      return v.isselect == true
    })
    
    if (selectAll.length == list.length) {
      this.setData({
        allSelect: true,
      })
    } else {
      this.setData({
        allSelect: false,
      })
    }

    this.setData({
      cartList: list,
      selectPiece: selectAll.length,
    });
    this.totalPrice();

    let cartArr = [];
    for (let i=0; i<list.length; i++) {
      cartArr.push({
        goodsprice: list[i].goodsprice,
        isselect: list[i].isselect,
        shopnum: list[i].shopnum,
        skuid: list[i].skuid,
      })
    }
    updateCartListSelect(list).then(function(res){
      // ...
    })

  },

  // 删除商品
  delHandler: function (e) {
    let idx = e.currentTarget.dataset.index;
    let list = this.data.cartList;
    list.splice(idx, 1)
    this.setData({
      cartList: list,
    })
    this.totalPrice();
  },

  // 滑动开始
  startHandler: function (e){
    let idx = e.currentTarget.dataset.index;
    let list = this.data.cartList;
    // 初始化坐标和获取组件默认left
    this.setData({
      startX: e.touches[0].pageX,
      defaultX: list[idx].left,
    })
    this.hideDelBtn(e);
  },

  // 滑动中
  moveHandler: function (e){
    let that = this.data;
    let idx = e.currentTarget.dataset.index;
    let list = this.data.cartList;

    // 获取移动距离
    let x = e.touches[0].pageX - that.startX;
    
    // 如果left值为0，组件只能左移
    if (that.defaultX == 0 && x < 0) {
      if (x < -120) {
        list[idx].left = -120;
      } else {
        list[idx].left = x;
      }
    }

    // 如果left值为-120，组件只能右移
    if (that.defaultX == -120 && x > 0) {
      if (x > 120) {
        list[idx].left = 0;
      } else {
        list[idx].left = that.defaultX + x;
      }
    }

    this.setData({
      cartList: list,
      move: x,
    })
  },
  
  // 滑动结束
  endHandler: function (e){
    let that = this.data;
    let idx = e.currentTarget.dataset.index;
    let list = this.data.cartList;

    // 判断移动距离是否超过60；给予组件优化移动效果

    if (that.defaultX == 0 && that.move > -60) {
      list[idx].left = 0;
    }

    if (that.defaultX == 0 && that.move <= -60) {
      list[idx].left = -120;
    }

    if (that.defaultX == -120 && that.move < 60) {
      list[idx].left = -120;
    }

    if (that.defaultX == -120 && that.move >= 60) {
      list[idx].left = 0;
    }

    this.setData({
      cartList: list,
      startX: 0,
      move: 0,
    })
  },

  // 选择全部
  selectAllHandler: function () {
    let list = this.data.cartList;
    let sel = this.data.allSelect
    if (sel) {
      list.map(function(v){
        if (v.isselect == true) {
          v.isselect = false;
        }
      })
      sel = false;
    } else {
      list.map(function(v){
        if (v.isselect == false) {
          v.isselect = true;
        }
      })
      sel = true;
    }
    
    let allSelect = list.filter(function(v){
      return v.isselect == true
    })

    this.setData({
      cartList: list,
      allSelect: sel,
      selectPiece: allSelect.length
    })
    this.totalPrice();
    updateCartListSelect(list).then(function(res){
      // ...
    })
  },

  // 设置商品数量
  getNum: function (e) {
    let val = e.detail.value;
    let idx = e.currentTarget.dataset.index;
    let list = this.data.cartList;
    list[idx].shopnum = val;

    this.setData({
      cartList: list,
      onFocus: true,
    })
    this.totalPrice();

    updateCartListNum(list).then(function(res){
      
    })
  },

  // 结算
  cartPay: function () {
    this.mjd.loginGetAuth(function(){
      wx.navigateTo({
        url: '/pages/order/submitOrder/submitOrder'
      })
    })
  },

  // 总价
  totalPrice: function () {
    let list = this.data.cartList;
    let total = 0;
    for (let i=0; i<list.length; i++) {
      if (list[i].isselect) {
        total += parseFloat(list[i].salesprice) * list[i].shopnum;
      }
    }
    let price = this.setZero(total)
    if (price.length - price.indexOf('.') > 3) {
      price = price.substring(0, price.indexOf('.')+3)
    } 
    this.setData({
      allPrice: price
    })
  },

  // 补零
  setZero:function (p) {
    let price = p.toString();
    
    if (price.indexOf('.') == -1) {
      return price = price + '.00'
    }

    if (price.length - price.indexOf('.') == 2) {
      return price = price + '0'
    }

    return price;
  },

  // 点击其他商品，隐藏已显示的删除按钮
  hideDelBtn: function (e) {
    let idx = e.currentTarget.dataset.index;
    let list = this.data.cartList;
    list.map(function(v,i){
      if ( i!= idx) {
        v.left = 0;
      }
    })
    this.setData({
      cartList: list,
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})