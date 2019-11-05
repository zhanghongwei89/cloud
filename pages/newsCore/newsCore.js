// pages/newsCore/newsCore.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg_type:null,
    url:'http://www.mypalmcloud.com/attachment/',
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.msg_type)
    this.setData({
      msg_type:options.msg_type
    })
    this.getList()
  },

  // 获取列表数据
  getList:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'message/list',
      data: {
        token:wx.getStorageSync('token'),
        msg_type:that.data.msg_type
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

  // 跳转消息详情
  goNewDet:function(e){
    // console.log(e.currentTarget.dataset.index)
    let mid = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../newsDet/newsDet?mid='+mid,
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