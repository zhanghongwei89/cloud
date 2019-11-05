// pages/newsDet/newsDet.js
const app = getApp()
var underscore = require('../../utils/underscore.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid:null,
    a:'',
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mid:options.mid
    })
    this.getNewsDet()
  },

  // 获取消息详情
  getNewsDet:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'message/info',
      data: {
        token:wx.getStorageSync('token'),
        mid:that.data.mid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res.data.data)
        that.setData({
          data:res.data.data
        })
        that.a()
      }
    })
  },

  // 转义
  a:function(){
    var zy = this.data.data.content
    var zyf = underscore.unescape(zy)
    this.setData({
      a:zyf
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