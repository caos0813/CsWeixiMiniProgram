/**
 * 分类首页
 * @development fanyonglong
*/
const { getCatalogue} = require('../../apis/category.js')
const app=getApp()
// pages/category/index.js
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
      selectedIndex:0,
      currentBannerIndex:0,
      categoryName:'',
      banner:[],
      categoryList:[],
      subcategoryList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  
  },
  showData()
  {
    getCatalogue(1).then(categoryList => {
      this.setNextData({ categoryList })
      this.showCategory(this.data.selectedIndex);
    })
  },
  showCategory:function(index)
  {
    let categoryList = this.data.categoryList, len = categoryList.length;
    if (index>=len)
    {
      return;
    }
    let item=this.data.categoryList[index];
    this.setNextData({
      currentBannerIndex:0,
      categoryName: item.catename,
      banner: item.topcatepic,
      subcategoryList: item.subcate,
      selectedIndex:index
    })
  },
  onTabItemTap(){
  //  this.showCategory(0);
    this.showData();
  },
  //显示分类下面子类
  onShowCategory(e)
  {
    this.showCategory(e.currentTarget.dataset.index)
  },
  //显示子类详情
  onShowSubCategory(e)
  {
    let  id=e.currentTarget.dataset.id;
    let subcate= this.data.categoryList[this.data.selectedIndex].subcate;
    let {cateid,catename,refvalue} = subcate.find(d=>d.cateid==id)
    this.mjd.navigateTo(`detail?id=${cateid}&catename=${catename}&sortid=${refvalue}`)
  },
  onBannerNav(e){
    let {index}=e.currentTarget.dataset;
    let { refvalue: spuid, type } = this.data.banner[index];
    if (type == 2) {
      this.mjd.showToast('暂不支持打开第三方页面');
    } else if (type == 1) {
      this.mjd.navigateTo(`/pages/goods/goodsDetail/goodsDetail?spuid=${spuid}`);
    }
  }
})