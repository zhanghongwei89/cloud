// pages/transfer/transfer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    btb:'',
    btc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      btc:options.btc
    })
  },

  // 获取地址val
  address:function(e){
    // console.log(e.detail.value)
    let that = this
    var add = e.detail.value
    this.setData({
      address:add
    })
  },

  // 获取比特币val
  btb:function(e){
    // console.log(e.detail.value)
    let that = this
    var btb = e.detail.value
    this.setData({
      btb:btb
    })
  },

  max:function(){
    this.setData({
      btb:this.data.btc
    })
  },

  // 提交审核
  btn:function(){
    let that = this
    var add = this.data.address
    var btb = parseFloat(this.data.btb)
    var btc = parseFloat(this.data.btc)
    if(btb>btc){
      wx.showToast({
        title: 'BTC余额不足',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.request({
      url: app.interfaceUrl+'user/btc_cash_out',
      data: {
        token:wx.getStorageSync('token'),
        r_link:add,
        money:btb
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