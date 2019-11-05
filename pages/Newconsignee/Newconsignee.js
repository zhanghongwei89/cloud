// pages/Newconsignee/Newconsignee.js
var address = require('../../utils/city.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo:'',
    is_default:0,
    mr:'../../icons/wxz.png',
    ts:'',
    show:false,
    token:'',
    buttonClicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    this.setData({
      token : app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
  },

  // 保存地址
  submit:function(e){
    console.log(e.detail.value.address)
    let that = this
    var username = e.detail.value.username
    var phone = e.detail.value.phone
    var zip = e.detail.value.zip
    var address = e.detail.value.address
    var detailed = e.detail.value.detailed
    var re = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[3|5|6|7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    var pattern = /[1-9]\d{5}(?!\d)/
    // 分开获取地区方便传参
    var region = address.split(' ')
    var province = region[0]
    var city = region[1]
    var state = region[2]
    var is_default = this.data.is_default
    // 判断
    if(username == ''){
      that.setData({
        ts:'请填写姓名',
        show:true
      })
      setTimeout(function(){
        that.setData({
          ts:'',
          show:false
        })
      },2000)
      return false
    }
    if(phone == ''){
      that.setData({
        ts:'请输入手机号',
        show:true
      })
      setTimeout(function(){
        that.setData({
          ts:'',
          show:false
        })
      },2000)
      return false
    }else if(!re.test(phone)){
      that.setData({
        ts:'请输入正确的手机号',
        show:true
      })
      setTimeout(function(){
        that.setData({
          ts:'',
          show:false
        })
      },2000)
      return false
    }
    if(zip == ''){
      that.setData({
        ts:'请输入邮编',
        show:true
      })
      setTimeout(function(){
        that.setData({
          ts:'',
          show:false
        })
      },2000)
      return false
    }else if(!pattern.test(zip)){
      that.setData({
        ts:'请输入正确的邮编',
        show:true
      })
      setTimeout(function(){
        that.setData({
          ts:'',
          show:false
        })
      },2000)
      return false
    }
    if(address == ''){
      that.setData({
        ts:'请选择地区',
        show:true
      })
      setTimeout(function(){
        that.setData({
          ts:'',
          show:false
        })
      },2000)
      return false
    }
    if(detailed == ''){
      that.setData({
        ts:'请填写详细地址',
        show:true
      })
      setTimeout(function(){
        that.setData({
          ts:'',
          show:false
        })
      },2000)
      return false
    }
    this.setData({
      buttonClicked: true
    })
    wx.request({
      url: app.interfaceUrl+'address/set',
      data: {
        name:username,
        mobile:phone,
        province:province,
        city:city,
        state:state,
        address:detailed,
        is_default:is_default,
        zip_code:zip,
        token:wx.getStorageSync('token')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res)
        if(res.data.code == 200){
          that.setData({
            ts:'保存成功',
            show:true
          })
        }
      },
      complete: function() {
        setTimeout(function(){
          that.setData({
            ts:'',
            show:false,
            buttonClicked: false
          })
          wx.navigateBack({
            delta: 1,
          })
        },2000)
      }
    })

  },

  // 默认选择
  mr:function(){
    var that = this
    var mr = this.data.is_default
    if(mr == 0){
      that.setData({
        is_default:1,
        mr:'../../icons/xz.png'
      })
    }else{
      that.setData({
        is_default:0,
        mr:'../../icons/wxz.png'
      })
    }
  },

  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    // 如果已经显示，不在执行显示动画
    if (that.data.addressMenuIsShow) {
      return
    }
    // 执行显示动画
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    // if (isShow) {
    //   // vh是用来表示尺寸的单位，高度全屏是100vh
    //   that.animation.translateY(0 + 'vh').step()
    // } else {
    //   that.animation.translateY(40 + 'vh').step()
    // }
    that.setData({
      // animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ' ' + that.data.citys[value[1]].name + ' ' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
    })
  },
  // 点击蒙版时取消组件的显示
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    // console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    // console.log(this.data)
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

  }
})