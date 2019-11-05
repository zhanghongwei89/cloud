// pages/invitation/invitation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    token:'',
    invite_code:'',
    rmb:[],
    sl:[],
    yq:[],
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token:app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    this.getInv()
    this.getInvrmb()
    this.getInvsl()
  },

  // 选项卡
  tabNav:function(e){
    let that = this
    var current = e.target.dataset.current
    this.setData({
      currentTab:current
    });
  },

  // 获取邀请返佣
  getInv:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'user/invite/info',
      data: {
        token:wx.getStorageSync('token')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        that.setData({
          invite_code:res.data.data.invite_code,
          yq:res.data.data.invite_list,
          data:res.data.data
        })
      }
    })
  },

  // 获取邀请返佣金额
  getInvrmb:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'user/agent_cny',
      data: {
        token:wx.getStorageSync('token'),
        p:1,
        ps:100
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        that.setData({
          rmb:res.data.data
        })
      }
    })
  },

  // 获取邀请返佣算力
  getInvsl:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'user/agent_power',
      data: {
        token:wx.getStorageSync('token'),
        p:1,
        ps:100
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        that.setData({
          sl:res.data.data
        })
      }
    })
  },

  // 复制文字
  copyText: function (e) {
    console.log(e)
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