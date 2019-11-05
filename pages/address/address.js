// pages/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    address:[],
    scts:1,
    msg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      token : app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    // console.log(wx.getStorageSync('token'))
    
  },

  // 获取地址列表
  getAddress:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'address/list',
      data: {
        token:wx.getStorageSync('token')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res.data.data)
        that.setData({
          address:res.data.data
        })
      }
    })
  },

  // 添加地址
  add:function(){
    if(!wx.getStorageSync('token')){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      return ;
    }else{
      wx.navigateTo({
        url: '../Newconsignee/Newconsignee',
      })
    }
  },

  // 删除地址
  delete:function(e){
    var index = e.currentTarget.dataset.index
    var add = this.data.address
    var aid = add[index].aid
    let that = this
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.interfaceUrl+'address/del',
            data: {
              aid:aid,
              token:wx.getStorageSync('token')
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              console.log(res)
              that.setData({
                msg:res.data.msg,
                scts:0
              })
              if (getCurrentPages().length != 0) {
                //刷新当前页面的数据
                getCurrentPages()[getCurrentPages().length - 1].onShow()
              }
            },
            complete: function() {
              setTimeout(function(){
                that.setData({
                  scts:1
                })
                if (getCurrentPages().length != 0) {
                  //刷新当前页面的数据
                  getCurrentPages()[getCurrentPages().length - 1].onShow()
                }
              },2000)
            }
          })
        }
        
      }
    })
   
  },

  // 编辑地址
  edit:function(e){
    var index = e.currentTarget.dataset.index
    var add = this.data.address
    var aid = add[index]
    let that = this
    console.log(aid)
    wx.navigateTo({
      url: '../Editconsignee/Editconsignee?aid='+JSON.stringify(aid),
      success: function(res){
        // success
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
    this.getAddress()
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