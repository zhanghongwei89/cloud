// pages/wallet/wallet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commission:0,
    profit:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  //获取钱包信息
  getWallet:function(){
    let that=this
    wx.request({
      url: app.interfaceUrl+'user/cash_out',
      data: {
        token:wx.getStorageSync('token'),
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res.data.data)
        that.setData({
          commission:res.data.data.commission,
          profit:res.data.data.profit
        })
      }
    })
  },

  // 复制文字
  copyText: function (e) {
    // console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  fb:function(){
    wx.navigateTo({
      url: '../fb/fb',
    })
  },

  zrqb:function(){
    let that=this
    wx.navigateTo({
      url: '../transfer/transfer?btc='+that.data.profit,
    })
  },
  wytx:function(){
    let that=this
    wx.navigateTo({
      url: '../cash/cash?rmb='+that.data.commission,
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
    this.getWallet()
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