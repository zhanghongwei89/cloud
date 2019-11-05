// pages/news/news.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('token'))
  },

  // 获取消息类别信息
  getNews:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'message/type',
      data: {
        token:wx.getStorageSync('token')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res.data.data)
        that.setData({
          data:res.data.data
        })
      }
    })
  },

  // 进入消息列表
  new:function(e){
    let msg_type = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../newsCore/newsCore?msg_type='+msg_type,
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
    this.getNews()
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