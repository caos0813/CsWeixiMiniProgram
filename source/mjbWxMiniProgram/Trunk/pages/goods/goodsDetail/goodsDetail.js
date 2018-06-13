/**
 *商品详情
 @dev fanyl
*/
const { getGoodsDetail, getGoodsSKUDetail, buyGoods } = require('../../../apis/goods.js')
const { getImageUrl, GOODS_NUM_LIMIT, CARTS_NUM_LIMIT}=require('../../../utils/config.js')
const { setCartList, getCartNum } = require('../../../utils/cart-list.js');
const app = getApp()
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    spuid:-1,
    shareIcon: getImageUrl('share'),
    shippingIcon:getImageUrl('goods-shipping'),
    day7Icon: getImageUrl('goods-7day'),
    ship24Icon: getImageUrl('goods-24Ship'),
    qualityIcon: getImageUrl('goods-quality'),
    previewDialog:0,
    previewIndex:0,
    swiperIndex:0,
    specVisible:false,
    skuinfo:[],
    skuattrname:[],
    sumStockqty:0,
    currentSkuIndex:[],
    bottomButtons:[],
    currentSkuInfo:{
      marketprice:0,
      saleprice:0,
      skuid:-1,
      skupic:'',
      spuid:-1,
      stockqty:0,
    },
    selectedSpecs:[],// 选中的规格
    selectedSpecsText:'',
    buyCount:1,
    serviceDescVisible:false, // 服务说明
    showGoTop:false,
    goodsInfoTopPos:false,
    cartGoodsNumber:0 // 购物车商品数量
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._pageScrollTop = new this.mjd.PageScroll(app.globalData.stytemInfo.windowHeight)
    this.data.spuid = options.spuid;
    this.showData();
    this._pageScrollTop.onDown(()=>{
      this.setData({
        showGoTop:true
      })
    })
    this._pageScrollTop.onUp(() => {
      this.setData({
        showGoTop:false
      })
    })
  },
  onReady(){
    var query = wx.createSelectorQuery();
    this._pageScrollInfo = new this.mjd.PageScroll(0) 
    this._pageScrollInfo.onDown(() => {
      this.setData({
        goodsInfoTopPos: true
      })
    })
    this._pageScrollInfo.onUp(() => {
      this.setData({
        goodsInfoTopPos: false
      })
    })
    query.select('.goods-info').boundingClientRect(r=>{
      this._pageScrollInfo.scrollPosition=r.top;

    }).exec()
  },
  showSKUData:app.mjd.once(function(){
    return getGoodsSKUDetail({
      spuid: this.data.spuid
    }).then(d=>{

      let skuinfo = d.skuinfo;     
      let skuattrname = d.skuattrname;      
      let sumStockqty=skuinfo.reduce((a,b)=>{
        a.stockqty += b.stockqty; 
        return a;
      }, { stockqty: 0 }).stockqty;

      this.data.skuinfo = skuinfo;
      skuattrname = skuattrname.map((d, groupIndex) => {
        d.index = groupIndex;
        d.templetvalue = d.templetvalue.map((c, index) => {
          c.index = index;
          // 当前规格所属SKU库存总量小于0
          c.status = this.getSkuidQuantitySum(c.attrskuid) > 0 ? 0 : 1;
          c.groupIndex = groupIndex;
          c.groupName = d.templetname;
          return c;
        });
        return d;
      });
      this.data.sumStockqty = sumStockqty;
      this.data.skuattrname = skuattrname;
      this.initSKUMatrixData();// SKU生成矩阵关系映射
      this.data.currentSkuIndex= this.getDefaultSkuSpecIndex();// 获取默认SKU
      this.updateSKUSpecStatus(false);// 更新SKU规格可用状态
    
    });
  }),
  showData(){
    return getGoodsDetail({
      spuid: this.data.spuid,
      isCustomError:true
    }).then(d=>{
      let { comment}= d;
      if (!comment.summary){
        comment.summary={
            commentcount:0,
            satisfactionval:0
          };
        }
      comment.list=[];
        if (comment.info){
          comment.list = [comment.info];
        }
        this.setNextData({
            goodsInfo:d
        })
    },(message)=>{
      this.mjd.showToast(message);
      this.mjd.redirectTo('/pages/index/index')
    })
  },
  getCurrentSKUBySkuid(skuid)
  {
    let skuinfo = this.data.skuinfo;
    return skuinfo.find(d=>d.skuid==skuid);
  },
  getSKUStockBySkuids(skuids){
    return this.data.skuinfo.filter(d=> this.includes(skuids,d.skuid));
  },
  getSkuidQuantitySum(skuids)
  {
    let result = this.getSKUStockBySkuids(skuids).reduce((a, b) => {  a.stockqty+=b.stockqty;  return a; }, { stockqty:0});
    return result.stockqty;
  },
  initSKUMatrixData()
  {
    var skuinfo = this.data.skuinfo;
    var skuattrname = this.data.skuattrname, maxlen = skuattrname.length, attrskuids=[],keys=[];
    var matrixData = {}, dimension = new Array(skuattrname.length);
    if(maxlen<=0){
      return matrixData;
    }
    function decompose(index,callback)
    {
      if (index >= maxlen)
      {
        callback();
        return;
      }

      let list = skuattrname[index].templetvalue;
      dimension[index] = list.length;
      for (let i = 0, len = list.length;i<len;i++)
      {
        attrskuids.push(list[i].attrskuid);
        keys.push(i);
        decompose(index+1,callback);
        attrskuids.pop();
        keys.pop();
      }
    }
    let list = skuattrname[0].templetvalue;
    dimension[0]=list.length;
    for (let i = 0, len = list.length; i < len; i++) {
      attrskuids.push(list[i].attrskuid);
      keys.push(i);
      decompose(1,()=> {
        let currentSKUID = -1;
        if (attrskuids.length == 1) {
          currentSKUID = attrskuids[0]
        } else if (attrskuids.length > 1) {
          let skuids = this.mjd.intersection.apply(this.mjd, attrskuids);
          if (skuids.length) {
            currentSKUID = skuids[0];
          }
        }
        if (currentSKUID != -1) {
          matrixData[keys.join('-')]=this.getCurrentSKUBySkuid(currentSKUID);
        }
      });
      attrskuids.pop();
      keys.pop();
    }

    this._matrixData = matrixData;
    this._dimension = dimension;
  },
  getSKUInfoByIndex(indexs)
  {
    return this._matrixData[indexs];
  },
  getDefaultSkuSpecIndex()
  {
    var matrixData = this._matrixData, keys = Object.keys(matrixData), item;  
    for (let i = 0, j = 0, len = keys.length; i<len; index++){
      item = matrixData[keys[i]];
      if (item&&item.stockqty>0)
      {
        return keys[i].split('-').map(id=>Number(id));
      }
    }
    return [];
  },
  updateSKUSpecStatus(specVisible)
  {
    let that = this, dimension = this._dimension;
    let currentSkuIndex = this.data.currentSkuIndex, indexLen = currentSkuIndex.length,skuItem;
    let skuattrname = this.data.skuattrname, maxLen = skuattrname.length, selectedSpecsText=[];
    
    function updateStatus(pos,index,callback)
    {
      if (index >= maxLen){
        let skuInfo=that.getSKUInfoByIndex(pos);
        return skuInfo?skuInfo.stockqty:0;
      }
      let list = skuattrname[index].templetvalue,totalQty=0, stockqty=0;
      for (let i = 0, len = list.length; i < len; i++) {
        stockqty = updateStatus(pos+'-'+i,index+1);
        if (stockqty <= 0 && list[i].status!=1){
          list[i].status=2;
        } else if (list[i].status==2){
          list[i].status =0;
        }
        totalQty += stockqty;
      }
      return totalQty;
    }
    if (indexLen>0){
      updateStatus(currentSkuIndex[0],1);
    }
    selectedSpecsText.length=0;
    for (let i = 0; i < indexLen;i++)
    {
      skuItem=skuattrname[i].templetvalue[currentSkuIndex[i]];
      selectedSpecsText.push(skuItem.attrname);
    }
    let currentSkuInfo= this.getSKUInfoByIndex(currentSkuIndex.join('-'))||{};
    this.setData({
      currentSkuIndex: currentSkuIndex,
      selectedSpecsText: selectedSpecsText.join(','),
      currentSkuInfo: this.mjd.extend(this.data.currentSkuInfo, currentSkuInfo),
      specVisible: specVisible,
      skuattrname: skuattrname
    });
  },
  includes(array,value)
  {
    for (let i = 0, len = array.length;i<len;i++){
      if(array[i]==value)
      {
        return true;
      }
    }
    return false;
  },
  showCartGoodsNumber()
  {
    getCartNum(num=>{
      this.setData({
        cartGoodsNumber: num
      })
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showCartGoodsNumber();
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
  onPageScroll(e){
    this._pageScrollTop.scroll(e.scrollTop);
    this._pageScrollInfo.scroll(e.scrollTop);
  },
  goTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
      title: this.data.title,
      path: `pages/goods/goodsDetail/goodsDetail?spuid=${this.data.spuid}&shopid=${app.globalData.shopid}`
    }
  },
  onShowServiceDesc()
  {
    this.setData({
      serviceDescVisible:true
    })
  },
  onTabChange(e){
    this.setData({
      swiperIndex:e.detail.index
    })
  },
  // 显示预览
  onShowPreview(){
    this.setData({
      previewDialog: this.data.previewDialog+1
    })
    // wx.previewImage({
    //   current: '', // 当前显示图片的http链接
    //   urls: piclist // 需要预览的图片http链接列表
    // })
  },
  onSwiperImageChange(e){
     
       this.setData({
         previewIndex: e.detail.current
       })
  },
  onBottomChange(e){
    let value = e.detail.value;
    this.setData({
      specVisible: false
    })
    if(value==2){
        this.mjd.showToast({
          title:'加入购物车成功',
          icon:'success',
          duration:2000
        })
        this.addShoppingCart();
    }else if(value==3){
      this.buyGoods();
    } 
  },
  buyGoods()
  {
    let cartItem = this.getCurrentCartItem(), responseStatusCode = this.mjd.responseStatusCode;
    buyGoods({
      isWrapSuccess: false,
      isCustomError: false,
      autoShowLoading: true,
      showLoadingText:'请求中...'
    },cartItem).then((res) => {
      if (res.code == responseStatusCode.NORMAL) {
        this.navToCartPage();
      } else if (res.code == responseStatusCode.CARTS_NUM_LIMIT) {
        this.mjd.showToast(`购物车最多只能加入${CARTS_NUM_LIMIT}个商品哦!`);
      } else {
        this.mjd.showToast('加入购物车失败，请重试');
      }
    }).catch((err) => {
      this.addShoppingCart();
      this.navToCartPage();
    })
   
  },
  navToCartPage() {
    this.mjd.switchTab('/pages/cart/cartList');
  },
  getCurrentCartItem()
  {
    let { currentSkuInfo, goodsInfo, buyCount } = this.data;
    let goodsprice = currentSkuInfo.saleprice > 0 ? currentSkuInfo.saleprice : goodsInfo.skupricemin;
    buyCount = Math.min(buyCount, currentSkuInfo.stockqty);
    return {
      goodsprice,
      isselect: true,
      shopnum: buyCount,
      skuid: currentSkuInfo.skuid
    };
  },
  // 增加到购物车中
  addShoppingCart()
  {

    setCartList(this.getCurrentCartItem());
    this.showCartGoodsNumber();
  },
  showBottomDialog(eventtype)
  {
    let goodsInfo = this.data.goodsInfo;
    if (goodsInfo.issoldout == 1 || goodsInfo.status == 9)
    {
      return;
    }
    this.showSKUData().then(() => {
      if (this.data.issoldout == 1 || this.data.sumStockqty<=0){
        this.setData({
          bottomButtons: [{ text: '已售馨', value:0, disabled:true }],
          specVisible: true
        });
        return;
      }
      if (eventtype==1){
        this.setData({
          bottomButtons: [{ text: '加入购物车', value:2 }, { text: '立即购买', value: 3 }],
          specVisible: true
        });
      }else {
        this.setData({
          bottomButtons: [{ text: '确定', value: eventtype }],
          specVisible: true
        });
      } 
    });
  },
  onShowSpec(e){
    this.showBottomDialog(1);
  },
  onSelectSpec(e)
  {
    let { groupIndex, index,status} = e.currentTarget.dataset;
    if (status>0){
      return;
    }
    this.data.currentSkuIndex[groupIndex] = index;
    this.updateSKUSpecStatus(true);
  },
  onBuy(e){
    this.showBottomDialog(3);
  },
  onAddShoppingCart(e) {
    this.showBottomDialog(2);
  },
  onBuyCount(e){
    this.setData({
      buyCount: e.detail.value
    })
  }
})