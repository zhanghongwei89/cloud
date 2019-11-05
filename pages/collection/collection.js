// pages/collection/collection.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    url:'http://www.mypalmcloud.com/attachment/',
    coll:[],
    ps:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token:app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取收藏列表
  getColl:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'user/collectlist',
      data: {
        p:1,
        ps:10,
        token:wx.getStorageSync('token')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res.data.data)
        that.setData({
          coll:res.data.data
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  // 跳转详情
  tz:function(e){
    let that = this 
    var index = e.currentTarget.dataset.index
    var coll = this.data.coll
    var idx = coll[index]
    var id = coll[index].pid
    wx.navigateTo({
      url: '../commodity/commodity?id='+id,
      
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getColl()
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
    let that = this
    var ps = that.data.ps
    ps +=10
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      ps:ps
    })
    wx.request({
      url: app.interfaceUrl+'user/collectlist',
      data: {
        p:1,
        ps:ps,
        token:wx.getStorageSync('token')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res.data.data)
        if (res.data.data.length == 0) {
          wx.showLoading({
            title: '加载完毕',
          })
          // console.log('加载完毕')
          return false
         
        } else if (res.data.data.length != 0) {
          //组合获取的数据
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.data.push(res.data.data[i])
          } 
          that.setData({          
            data: that.data.data,
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})