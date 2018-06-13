// pages/search/search.js
const {
  gethotsearch,
  getSearchList
} = require('../../apis/goods.js');
const wxAPI = require('../../utils/wx-api.js');
const {
  getImageUrl
} = require('../../utils/config.js')
const app = getApp();

app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch: true,
    // 搜索   
    historyList: [],
    hotSearchList: [],
    isSearchValue: false,
    searchValue: "",
    cancel: "取消",
    // 搜素结果
    emptyImage: getImageUrl('empty'),
    orderfield: 5,
    orderform: 2,
    goodsArr: [],
    searchResultValue: "",
    isShow: true,
    dropDown: 0,
    loading: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var value = wx.getStorageSync("historyList") || [];
    this.setNextData({
      historyList: value
    })
    // 读取热门搜索数据
    gethotsearch().then(list => {
      this.setNextData({
        hotSearchList: list
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  onInput(e) {
    if (this.data.isSearch) {
      e.detail.value.length > 0 ? this.setNextData({
        isSearchValue: true,
        cancel: "搜索",
        searchValue: e.detail.value
      }) : this.setNextData({
        isSearchValue: false,
        cancel: "取消"
      });
    } else {
      e.detail.value.length > 0 ? this.setNextData({
        isSearchValue: true
      }) : this.setNextData({
        isSearchValue: false
      });
    }
  },
  // 点击键盘搜索事件
  onConfirm(e) {
    this.showSearchResult(e.detail.value);
  },
  // 取消事件
  onCancel() {
    if (this.data.cancel == "取消") {
      this.setNextData({
        cancel: "搜索",
        isSearch: false
      })
      wx.navigateBack();
    } else {
      this.setNextData({
        cancel: "取消"
      })
       this.showSearchResult(this.data.searchValue);
    }
  },
  // 文本框中按钮删除事件
  onClear() {
    this.data.isSearch ? this.setNextData({
      searchResultValue: "",
      cancel: "取消"
    }) : this.setNextData({
      searchValue: "",
      cancel: "取消"
    });
  },
  // 清空历史记录事件
  onClearHistory() {    
    wx.clearStorageSync();
    this.setNextData({ historyList:[]})
  },
  // 点击历史记录或热门搜索中的数据事件
  onSearch(item) {
    this.showSearchResult(item.target.dataset.item);
  },
  // 显示搜索结果页
  showSearchResult(value) {
    var that = this;
    that.setNextData({
      isSearch: false,
      searchResultValue: value,
      isValue: true
    })
    this.data.historyList.unshift(value);
    this.setNextData({
      searchValue: value,
      historyList: [...new Set(this.data.historyList)]
    });
    wx.setStorageSync("historyList", this.data.historyList);

    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    })
    this.pager.setTotal(9999999999999); // 接口未返回总记录数，设置
    this.pager.onChange((pageIndex, status) => {
        this.setNextData({
          pageIndex: pageIndex
        })
      //点击上面排序过滤作为刷新加载
      if (status == 'refresh') {
        this.data.goodsArr = []; // 请求之前先清空数组
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        this.setNextData({
          scrollTop: 0, //滚动条滚到最前面 
          loading: 0
        })
        this.pager.emit('read'); // 触发read加载数据
        return;
      }
      this.pager.emit(status)
    });
    // 读取时
    this.pager.on('read', () => {
      this.getList().then(goodList => {
        // 没有数据，显示空
        if (goodList.goods.length <= 0) {
          this.setNextData({
            isShow: false
          });
        } else {
          this.setNextData({
            goodsArr: goodList.goods,
            isShow: true
          });
          this.showLoadMore(goodList)
        }
      })
    })
    // 上拉加载下一页时
    this.pager.on('next', () => {
      // 请求之前，显示加载效果
      this.setNextData({
        loading: 1
      })
      this.getList(false).then(goodList => {
        // 追加数据到列表中
        if (goodList.goods.length > 0) {
          this.data.goodsArr.push(...goodList.goods);
          this.setNextData({
            goodsArr: this.data.goodsArr
          });
        }
        this.showLoadMore(goodList.goods)

      })
    })
    this.pager.read();
  },
  getList: function (autoShowLoading = true) {
    return getSearchList({
      orderfield: this.data.orderfield,
      orderform: this.data.orderform,
      search: this.data.searchResultValue,
      pageindex: this.data.pageIndex
    }, autoShowLoading);
  },
  showLoadMore(goodList) {
    // 如果结果集长度小于当前页大小，代表数据读到最后一页了
    if (goodList.length < this.pager.pageSize) {
      this.pager.lock(); //没有下一页，锁住分页，不进行下一页   
      // 显示没有更多数据了
      this.setNextData({
        loading: 2
      })
    } else {
      // 隐藏加载效果
      this.setNextData({
        loading: 0
      })
    }
  },
  onChange(e) {
    this.data.orderform = e.detail.sort;
    this.data.orderfield = e.detail.value;
    this.pager.unlock();
    this.pager.refresh();
  },
  onFocus(e) {
    this.setNextData({
      isSearch: true,
      searchValue: e.detail.value,
      cancel: '搜索'
    })
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
    this.pager.next();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})