// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is:0,
    num:0,
    send: true,
    alreadySend: false,
    second: 60,
    disabled: true,
    phoneNum:'',
    code:'',
    iv:'',
    encryptedData:'',
    nikeName:'',
    user:'',
    dis:true,
    phone:'',
    phoneIv:'',
    phoneEn:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      phone:options.phone,
      phoneNum:options.phone,
      phoneEn:options.phoneEn,
      phoneIv:options.phoneIv
    })
    if(options.phone != ''){
      that.setData({
        dis:false
      })
    }
  },

  radio:function(){
    let that = this
    var num = this.data.num
    num++
    if(num%2==0){
      that.setData({
        num:num,
        is:0,
      })
    }else{
      that.setData({
        num:num,
        is:1,
      })
    }
  },

  // 获取用户信息
  bindGetUserInfo:function(){
    let that = this
    
    wx.getSetting({
      success:function(res){
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          that.sendMsg()
          wx.getUserInfo({
            success: function(res) {
              // console.log(res)
              that.setData({
                iv:res.iv,
                encryptedData:res.encryptedData,
                nikeName:res.userInfo.nickName,
                user:res.userInfo,
              })
              // console.log(that.data.code)
             
            }
          })
        }
      }
    })
  },

  // 获取验证码
  inputPhoneNum: function (e) {
    let that = this
    let phoneNum = e.detail.value
    this.setData({
      phoneNum: phoneNum
    })
    if(phoneNum.length != 11){
      that.setData({
        dis:true
      })
    }else{
      that.setData({
        dis:false
      })
    }
  },

  sendMsg: function () {
    let that = this
    let phoneNum = this.data.phoneNum;
    // console.log(phoneNum)
    if(phoneNum == ''){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    // 微信获取验证码code
    wx.login({
      success: function(res){
        // success
        // console.log(res)
        that.setData({
          code:res.code
        })
      }
    })
    // console.log(that.data.phoneNum)
    //此处省略发送短信验证码功能
    wx.request({
      url: app.interfaceUrl+'sendcode?user_mobile='+that.data.phoneNum,
      // data: {
      //   // user_mobile:that.data.phoneNum
      // },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
    
    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
  },
  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },
  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  // 注册登录
  formSubmit:function(e){
    var phone = e.detail.value.phone
    var yzm = e.detail.value.yzm
    let that = this
    if(phone == ''){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    if(yzm == ''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    if(that.data.is !=1){
      wx.showToast({
        title: '请勾选用户协议',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    wx.request({
      url: app.interfaceUrl+'verifcode',
      data: {
        user_mobile:phone,
        code:yzm
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        if(res.data.code == 200){
          wx.request({
            url: app.interfaceUrl+'wlogin',
            data: {
              phoneIv:that.data.phoneIv,
              phoneEn:that.data.phoneEn,
              code:that.data.code,
              iv:that.data.iv,
              encryptedData:that.data.encryptedData
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              // success
              console.log(res)
              wx.setStorageSync('token',res.data.data.token);
              app.globalData.token = wx.getStorageSync('token')
              wx.showToast({
                title: '登录成功',
                icon: 'none',
                duration: 2000
              })
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
              // console.log(that.data.user)
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
        }else{
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
            duration: 2000
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