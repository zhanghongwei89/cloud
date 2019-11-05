// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIphone: wx.canIUse('button.open-type.getPhoneNumber'),
    code:'',
    phoneEn:'',
    phoneIv:'',
    iv:'',
    en:'',
    show:true,
    yshow:false,
    nikeName:'',
    user:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      token:app.globalData.token
    })
    
    wx.checkSession({
      success: function(res){
        console.log('有缓存')
        that.setData({
          show:false,
          yshow:true
        })
        wx.getUserInfo({
          success: function(res){
            // success
            // console.log(res)
            that.setData({
              nikeName:res.userInfo.nickName,
              user:res.userInfo
            })
          },
        })
      },
      fail: function(res){
        console.log('重新登录')
        　that.setData({
          show:true,
          yshow:false
        })　
      }
    })
    wx.login({
      success: function(res){
        that.setData({
          code:res.code
        })
      }
    })
    
      
  },

  // 一键登录
  test:function(){
    let that = this
    // console.log(that.data.code)
    wx.request({
      url: app.interfaceUrl+'minicode?code='+that.data.code,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        wx.setStorageSync('token',res.data.data.token);
        app.globalData.token = wx.getStorageSync('token')
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

  // 获取手机号
  getPhoneNumber:function(e){
    let that = this
    this.setData({
      phoneIv:e.detail.iv,
      phoneEn:e.detail.encryptedData,
    })
    if(e.detail.errMsg == 'getPhoneNumber:fail user deny'){
      wx.showToast({
        title: '取消授权',
        icon: 'none',
        duration: 2000
      })
      return
    }else{
      wx.request({
        url: app.interfaceUrl+'getUserphone',
        data: {
          phoneIv:e.detail.iv,
          phoneEn:e.detail.encryptedData,
          code:that.data.code,
          phone:''
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          
        },
        fail: function() {
          // fail
        },
        complete: function(res) {
          // complete
          console.log(res)
          if(res.data.data.new_user == 0){
            wx.navigateTo({
              url: '../register/register?phone='+res.data.data.mobile,
            })
          }else if(res.data.data.new_user == 1){
            wx.navigateTo({
              url: '../sign/sign?phone='+res.data.data.mobile+'&phoneIv='+that.data.phoneIv+'&phoneEn='+that.data.phoneEn,
            })
          }
        }
      })
    }
     
    
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