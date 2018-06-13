// pages/address/manager.js

const { getAddressList, getStreetList, editAddress, addAddress, getAddressTagList, getAddressId } = require('../../apis/address.js');
const cityData = require('../../utils/city.js');
const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    showCityWrap: false,
    showStreetWrap: false,
    editContent: null,
    labelData: [],
    region: "请选择送货地址",
    street: "请选择街道",
    streetData: [],         // 接收的街道数据
    streetCoordinate: [0],  // 街道坐标
    coordinate: [0, 0, 0],  // 地区坐标
    province: ['请选择'],
    city: ['请选择'],
    area: ['请选择'],
    streetArr: ['请选择'],
    areaId: null,      // 地区ID
    streetId: null,    // 街道ID
    labelId: 1,        // 标签ID
    oldProvince: null, // 选择省份还原市县
    oldCity: null,     // 选择市还原县
    defaultCoordinate: null,  // 默认地址坐标
    defaultProvince: [],      // 默认省份列表
    defaultCity: [],          // 默认城市列表
    defaultArea: [],          // 默认区县列表
    defaultAreaId: [],        // 默认地区ID
    defaultStreetCoordinate: null,  // 默认街道坐标
    changeAddress: false,     // 是否点击确认修改地址，来判断还原默认
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let province = ["请选择"];
    let city = ["请选择"];
    let area = ["请选择"];
    let street = ["请选择"];
    let that = this;
    // 编辑收货地址初始化
    if (options.address_id) {
      wx.setNavigationBarTitle({
        title: "编辑收货地址"
      })
      getAddressId({ address_id: options.address_id }).then(function(res){
        let editContent = res[0];
        for (let i in cityData.default) {
          province.push(i);
          if (i == editContent.areaAName) {
            for (let j in cityData.default[i]) {
              city.push(j)
              if (j == editContent.areaBName) {
                for ( let k in cityData.default[i][j]) {
                  area.push(k);
                }
              }
            }
          }
        }
        that.setData({
          province: province,
          city: city,
          area: area,
          areaId: editContent.areacid,
          streetId: editContent.areadid,
          labelId: editContent.addr_label_id,
          defaultProvince: province,
          defaultCity: city,
          defaultArea: area,
          defaultAreaId: editContent.areacid,
          editContent: editContent,
          street: editContent.areaDName,
          region: editContent.areaAName + ' ' + editContent.areaBName + ' ' + editContent.areaCName
        })
        getStreetList({ area_id: editContent.areacid }).then(function(res){
          if (res.length == 0) {
            that.setData({
              streetArr: ['暂无可选街道'],
              streetData: [
                {
                area_id: 0,
                area_level: 0,
                area_name: "暂无可选街道",
                p_area_id: 0,
                rank: 0,
                zip_code : ""}
              ],
              street: '暂无可选街道',
            })
          } else {
            let arr = res.map(function(v){return v.area_name})
            that.setData({
              streetArr: street.concat(arr),
              streetData: res,
            })
          }
        })
        getAddressTagList().then(function(res){
          for (let i=0; i<res.length; i++) {
            if (res[i].addr_label_id == editContent.addr_label_id) {
              res[i].handler = true;
            } else {
              res[i].handler = false;
            }
          }
          that.setData({
            labelData: res
          })
        })
      })
    } else {
      for (let i in cityData.default) {
        province.push(i);
      }
      this.setData({
        province: province,
        defaultProvince: province,
        defaultCity: city,
        defaultArea: area,
      })
      getAddressTagList().then(function(res){
        for (let i=0; i<res.length; i++) {
          if (i == 0) {
            res[0].handler = true;
          } else {
            res[i].handler = false;
          }
        }
        that.setData({
          labelData: res
        })
      })
    }
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

  // 保存地址
  formSubmit: function (e) {
    let data = e.detail.value;
    let that = this.data;
    let defaultSet = 1;
    let reg = /(1[3-8]\d{9})/

    if (data.contactname.length == 0) {
      this.showError('请输入收货人姓名！');
      return;
    }
    
    if (data.mobile.length == 0) {
      this.showError('请输入电话号码！');
      return;
    }

    if (!reg.test(data.mobile)) {
      this.showError('请输入格式正确的电话号码！');
      return;
    }
    
    if (!that.areaId) {
      this.showError('请选择城市及地区！')
      return;
    }

    if (!that.streetId && this.data.street != '暂无可选街道') {
      this.showError('请选择街道！')
      return;
    }

    if (data.addressdetail.length == 0) {
      this.showError('请输入具体收货地址！');
      return;
    }

    if (!data.defaultflag) {
      defaultSet = 0;
    }

    if (that.editContent) {
      editAddress({
        addressid: that.editContent.address_id,
        addrlabelid: that.labelId,
        telephone: that.editContent.telephone,
        addresszip: that.editContent.zip,
        defaultflag: defaultSet,
        countryid: that.areaId,
        streetid: that.streetId,
        contactname: data.contactname,
        mobile: data.mobile,
        addressdetail: data.addressdetail,
      }).then(function(res){
        wx.showToast({
          title: '编辑成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      })
    } else {
      addAddress({
        addressid: 0,
        addrlabelid: that.labelId,
        telephone: "",
        addresszip: "",
        defaultflag: defaultSet,
        countryid: that.areaId,
        streetid: that.streetId,
        contactname: data.contactname,
        mobile: data.mobile,
        addressdetail: data.addressdetail,
      }).then(function(res){
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      })
    }
  },

  // 判断提交内容错误提示语
  showError: function (txt) {
    wx.showToast({
      title: txt,
      icon: 'none',
      duration: 1500
    })
  },

  // 设置地址
  bindChange: function (e) {
    let val = e.detail.value;
    let city = ['请选择'];
    let area = ['请选择'];
    let areaId = [];

    // 滚动更新地址；
    if ( val[0] != this.data.oldProvince) {
      val[1] = 0;
      val[2] = 0;
    }

    if ( val[1] != this.data.oldCity) {
      val[2] = 0;
    }

    for (let i in cityData.default) {
      if (i == this.data.province[val[0]]) {
        for (let j in cityData.default[i]) {
          city.push(j);
          if (j == this.data.city[val[1]]) {
            for (let k in cityData.default[i][j]) {
              area.push(k);
              areaId.push(cityData.default[i][j][k])
            }
          }
        }
      }
    }

    console.log(areaId)

    this.setData({
      city: city,
      area: area,
      areaId: val[2] > 0 ? areaId[val[2] - 1] : 0,
      coordinate: val,
      oldProvince: val[0],
      oldCity: val[1],
    })
  },

  // 显示地址选择控件
  changeRegion: function () {
    let val = this.data.coordinate;
    let address = this.data.region.split(' ');

    if (this.data.editContent) {
      if(!this.data.changeAddress) {
        val[0] = this.setCityList(this.data.province, this.data.editContent.areaAName);
        val[1] = this.setCityList(this.data.city, this.data.editContent.areaBName);
        val[2] = this.setCityList(this.data.area, this.data.editContent.areaCName);
      } else {
        val[0] = this.setCityList(this.data.province, address[0]);
        val[1] = this.setCityList(this.data.city, address[1]);
        val[2] = this.setCityList(this.data.area, address[2]);
      }
    }

    this.setData({
      showCityWrap: true,
      coordinate: val,
      defaultCoordinate: val,
      oldProvince: val[0],
      oldCity: val[1],
    })
  },

  // 地址选择控件取消按钮
  cityCancel: function() {
    // 取消还原默认数据

    this.setData({
      coordinate: this.data.defaultCoordinate,
      province: this.data.defaultProvince,
      city: this.data.defaultCity,
      area: this.data.defaultArea,
      showCityWrap: false,
    })

    if (this.data.editContent) {
      let val = this.data.coordinate;
      if(!this.data.changeAddress) {
        this.setData({
          region: this.data.editContent.areaAName + ' ' + this.data.editContent.areaBName + ' ' + this.data.editContent.areaCName,
        })
      } else {
        this.setData({
          region: this.data.province[val[0]] + ' ' + this.data.city[val[1]] + ' ' + this.data.area[val[2]],
        })
      }
    }
  },
  
  // 地址选择控件确定按钮
  cityCheck: function() {
    let val = this.data.coordinate;
    if (this.data.city[val[1]].indexOf('请选择') > -1 || this.data.area[val[2]].indexOf('请选择') > -1) {
      wx.showToast({
        icon: 'none',
        title: '请选择具体城市区县！',
        duration: 2000
      })
      return;
    }

    this.setData({
      defaultProvince: this.data.province,
      defaultCity: this.data.city,
      defaultArea: this.data.area,
      region: this.data.province[val[0]] + ' ' + this.data.city[val[1]] + ' ' + this.data.area[val[2]],
      showCityWrap: false,
      changeAddress: true,
    })

    if (this.data.defaultAreaId != this.data.areaId) {
      let that = this;
      getStreetList({ area_id: this.data.areaId }).then(function(res){
        if (res.length == 0) {
          that.setData({
            streetArr: ['暂无可选街道'],
            streetData: [
              {
                area_id: 0,
                area_level: 0,
                area_name: "暂无可选街道",
                p_area_id: 0,
                rank: 0,
                zip_code : ""
              }
            ],
            street: '暂无可选街道',
          })
        } else {
          let street = ["请选择"];
          let arr = res.map(function(v){return v.area_name})
          that.setData({
            streetArr: street.concat(arr),
            streetData: res,
            street: '请选择街道',
            streetId: null,
          })
        }
      })
    }
  },

  // 设置地址选择控件
  setCityList: function (list, name) {
    var num = 0;
    for (let i=0; i<list.length; i++) {
      if (list[i] == name) {
        num = i;
      }
    }
    return num;
  },

  // 设置街道
  bindStreetChange: function (e) {
    let val = e.detail.value;
    this.setData({
      streetCoordinate: val,
    })
  },

  // 显示街道选择控件
  changeStreetRegion: function () {
    let data = this.data.streetData
    let val = [];
    for (var i=0; i<data.length; i++) {
      if (this.data.street == data[i].area_name) {
        val.push(i)
      }
    }
    
    if (this.data.street != '暂无可选街道') {
      val = [val[0]+1]
    }

    this.setData({
      showStreetWrap: true,
      streetCoordinate: val,
      defaultStreetCoordinate: val,
    })
  },

  // 街道选择控件 取消按钮
  streetCancel: function () {
    this.setData({
      showStreetWrap: false,
      streetCoordinate: this.data.defaultStreetCoordinate
    })
  },

  // 街道选择控件 确认按钮
  streetCheck: function () {
    let data = this.data.streetData;
    let street = '';
    let streetId = 0;

    if (data.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择具体城市区县,再选择街道！',
        duration: 2000
      })
      return;
    }

    if (this.data.street != '暂无可选街道') {
      this.setData({
        streetCoordinate: [this.data.streetCoordinate[0] - 1]
      })
    }
    for (let i = 0; i<data.length; i++) {
      if (this.data.streetCoordinate[0] == i) {
        street = data[i].area_name;
        streetId = data[i].area_id;
      }
    }
    
    if (!street) {
      wx.showToast({
        icon: 'none',
        title: '请选择具体街道！',
        duration: 2000
      })
      return;
    }

    this.setData({
      street: street,
      streetId: streetId,
      showStreetWrap: false,
    })
  },

  // 标签按钮
  labelBtn: function (e) {
    var data = this.data.labelData
    for (let i=0; i<data.length; i++) {
      if (e.currentTarget.dataset.value == data[i].addr_label_id) {
        data[i].handler = true;
        this.setData({
          labelId: data[i].addr_label_id,
        })
      } else {
        data[i].handler = false;
      }
    }
    this.setData({
      labelData: data
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