// pages/cash/cash.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    naem:'',
    add:'',
    cny:'',
    rmb:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rmb:options.rmb
    })
    console.log(this.data.rmb)
  },

  name:function(e){
    var name = e.detail.value
    this.setData({
      name:name
    })
  },
  add:function(e){
    var add = e.detail.value
    this.setData({
      add:add
    })
  },
  cny:function(e){
    var cny = e.detail.value
    this.setData({
      cny:cny
    })
  },

  max:function(){
    this.setData({
      cny:this.data.rmb
    })
  },
  btn:function(){
    let that = this
    var name = this.data.name
    var add = this.data.add
    var cny = parseFloat(this.data.cny)
    var rmb = parseFloat(this.data.rmb)
    if(cny>rmb){
      wx.showToast({
        title: '余额不足',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.request({
      url: app.interfaceUrl+'user/cny_cash_out',
      data: {
        token:wx.getStorageSync('token'),
        r_link:add,
        r_name:name,
        money:cny
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        if(res.data.code == 401){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          return false
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../examine/examine',
            })
          },2000)
        }
      }
    })
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