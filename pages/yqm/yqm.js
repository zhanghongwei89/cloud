// pages/yqm/yqm.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateNumber:[],
    iv:'',
    en:'',
    phone:'',
    yzm:'',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.iv)
    console.log(options.phone)
    console.log(options.en)
    console.log(options.yzm)
    console.log(options.code)
    this.setData({
      iv:options.iv,
      en:options.en,
      phone:options.phone,
      yzm:options.yzm,
      code:options.code
    })
  },

  inputPlateNumber:function(e){
    this.setData({
      plateNumber:e.detail.value
    })
    // console.log(this.data.plateNumber)
  },

  // 注册
  reg:function(){
    let that = this
    let yqm = this.data.plateNumber
    console.log(yqm)
    wx.request({
      url: app.interfaceUrl+'wxSignup',
      data: {
        user_mobile:that.data.phone,
        user_code:that.data.yzm,
        from_invite_code:yqm,
        code:that.data.code,
        iv:that.data.iv,
        encryptedData:that.data.en
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        wx.setStorageSync('token',res.data.data.token);
        app.globalData.token = wx.getStorageSync('token')
        wx.showToast({
          title: '注册成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        setTimeout(function(){
          wx.switchTab({
            url: '../user/user?nikeName='+that.data.nikeName+'&user='+that.data.user,
            success: function(res){
              // success
            }
          },4000)
        })
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