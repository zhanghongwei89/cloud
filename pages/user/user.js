// pages/user/user.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIphone: wx.canIUse('button.open-type.getPhoneNumber'),
    nikeName:'',
    user:[],
    hid1:false,
    hid2:true,
    code:'',
    iv:'',
    encryptedData:'',
    opId:'',
    phoneIv:'',
    phoneEn:'',
    mobile:'',
    zjTx:'',
    zjNikename:'',
    zjPhone:'',
    numericalVal:0,
    token:'',
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      token:app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    this.setData({
      nikeName:options.nikeName,
      user:options.user
    })
     
  },
  
  
  // 跳转购物车
  shopcar:function(){
    if(wx.getStorageSync('token') == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
    }else{
      wx.switchTab({
        url: '../shopCar/shopCar',
      })
    }
    
  },
  // 跳转收藏
  coll:function(){
    if(wx.getStorageSync('token') == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
    }else{
      wx.navigateTo({
      url: '../collection/collection',
    })
    }
    
  },
  // 跳转地址
  add:function(){
    if(wx.getStorageSync('token') == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
    }else{
      wx.navigateTo({
      url: '../address/address',
    })
    }
    
  },
  // 跳转邀请返佣
  inv:function(){
    if(wx.getStorageSync('token') == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
    }else{
      wx.navigateTo({
      url: '../invitation/invitation',
    })
    }
    
  },
  // 跳转消息
  news:function(){
    if(wx.getStorageSync('token') == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
    }else{
      wx.navigateTo({
      url: '../news/news',
    })
    }
    
  },
  // 跳转钱包
  wallet:function(){
    if(wx.getStorageSync('token') == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
    }else{
      wx.navigateTo({
      url: '../wallet/wallet',
    })
    }
    
  },

  // 退出登录
  logout:function(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '您确定要退出吗？',
      success:function(res){
        if(res.confirm){
          wx.setStorageSync('token','');
          that.setData({
            nikeName:'',
            user:'',
            numericalVal:0,
          })
          wx.showToast({
            title: '退出成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function(){
            if (getCurrentPages().length != 0) {
              //刷新当前页面的数据
              getCurrentPages()[getCurrentPages().length - 1].onShow()
            }
          },2000)
              
        }
      }
    })
  },
 
  // 获取手机号
  getPhoneNumber (e) {
    let that = this
    console.log(e)
    that.setData({
      phoneIv:e.detail.iv,
      phoneEn:e.detail.encryptedData,
      
    })

    wx.request({
      url: app.interfaceUrl+'wlogin',
      data: {
        phoneIv:that.data.phoneIv,
        phoneEn:that.data.phoneEn,
        code:that.data.code,
        iv:that.data.iv,
        encryptedData:that.data.encryptedData,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       //header: {header}, // 设置请求的 header
      success: function(res){
        // console.log(res)
        that.setData({
          mobile:res.data.data.mobile,
          hid2:true,
        })
        // wx.setStorageSync('token',res.data.data.token);
        // wx.setStorageSync('token',res.data.data.token);
        // app.globalData.token = res.data.data.token
        // console.log( app.globalData.token)
        that.login()
      }
    })
  },

  // 判断登录
  login :function(){
    let that = this
    let time = new Date();
    // let createTime = wx.getStorageSync('createTime');
    // let token = wx.getStorageSync('token');
    let token = wx.getStorageSync('token');
    if (!token) {
    //不存在token，调用登录
      console.log('no token')
      // wx.clearStorage()
    }else {
    //token有效，获取信息按钮隐藏并调用接口
      console.log('token有效')
      that.setData({
        hid1:true,
      })
      that.getUser()
      
    }
    // else if (time - createTime > 6 * 24 * 3600 * 1000) {
    //   //token过期（假设是6天），调用登录
    //   console.log('token時間到了')
    // }
  },

  // 在有token的时候渲染接口
  getUser:function(e){
    // let toKen = wx.getStorageSync('token');
    let toKen = wx.getStorageSync('token');
    app.globalData.token = toKen
    let that = this
    wx.request({
      url: app.interfaceUrl+'myself',
      data: {
        'token':toKen
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type':'application/x-www-form-urlencoded',
        'token':toKen
      }, // 设置请求的 header
      success: function(res){
        // console.log(res)
        if(res.data.code == 401){
          that.setData({
            hid1:false,
            numericalVal:0
          })
          wx.clearStorage({
            success:function(res){
              that.setData({
                nikeName:'',
                user:[],
                mobile:''
              })
            }
          })
          // console.log('清除')
          // that.getPhoneNumber()
        }else{
          that.setData({
            zjTx:res.data.data.avator,
            zjNikename:res.data.data.user_title,
            zjPhone:res.data.data.user_mobile,
            numericalVal:1,
            data:res.data.data
          })
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
    // this.login()
    // let token = wx.getStorage({
    //   key: 'token',
    //   success: function(res){
    //     // success
    //     console.log(res.data)
    //   },
     
    // })
    this.login()
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