/**
 *分类详情
*/
const { getGoodList } = require('../../apis/goods.js')
const app=getApp()





app.Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:-1,
      catename:'',
      sortid:'',
      orderfield:5,
      orderform:2,
      goodList: [],
      isShow:true,
      dropDown:0,
      isFilterBar:true // 默认显示过滤条
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.id=options.id;
    this.data.catename = options.catename;
    this.data.sortid = options.sortid;

    this.pager = new this.mjd.Pager({
        pageIndex:1,
        pageSize:10
    })
    this.pager.setTotal(9999999999999);// 接口未返回总记录数，设置
    // 页变化
    this.pager.onPageChange(function(pageIndex){
      that.showData(false)
    })
    // 页数发生变化
    this.pager.onPageCountChange(function(){
    })
    // 刷新时
    this.pager.onRefresh(function(){
      this.unlock();// 刷新时解锁
      that.data.goodList=[];
      that.showData(false).then(()=>{
        that.mjd.stopPullDownRefresh()
      })
    })
    // 创建滚时下filterbar隐藏,暂时不使用
    this._scroll = new this.mjd.PageScroll(80);
    this._scroll.onDown(()=>{
      this.setNextData({ isFilterBar:false})
    })
    this._scroll.onUp(() => {
      this.setNextData({ isFilterBar: true })
    })
    this.showData().then(()=>{
      if (this.data.goodList.length <= 0) {
        this.setNextData({ isShow: false });
      }
    });
  },
  showData: function (autoShowLoading=true)
  {
    return getGoodList({
      cateid: this.data.id,
      sortid: this.data.sortid,
      orderfield: this.data.orderfield,
      orderform: this.data.orderform,
      pageindex: this.pager.pageIndex
    }, autoShowLoading).then(goodList => {
      if(goodList.length>0){
      this.data.goodList.push(...goodList);
      this.setNextData({ goodList: this.data.goodList});
      }else{
        this.pager.lock();//当没有数据了，代表没有下一页，锁住分页，不进行下一页   
      }
  
    },()=>{

    })
  },
  bindFilterChange(e){
    this.data.orderfield=e.detail.value
    this.data.orderform = e.detail.sort;
    this.data.goodList = [];
    this.showData(1);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mjd.setNavigationBarTitle(this.data.catename);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
   * 在JSON配置，已禁用下拉刷新
   */
  onPullDownRefresh: function (e) {
     this.pager.refresh();
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    this.pager.next();
  },
  _prevScrollTop:null,
  onPageScroll:function(e)
  {
   // this._scroll.scroll(e.scrollTop)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})