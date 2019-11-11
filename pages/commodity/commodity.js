// pages/commodity/Commodity.js
const app = getApp()
var underscore = require('../../utils/underscore.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    xzfs:1,
    pid:'',
    url:'http://www.mypalmcloud.com/attachment/',
    details:[],
    all:1,
    fw:1,
    cs:1,
    gg:1,
    num:1,
    add:1,
    token:'',
    msg:'',
    qian:0,
    sd:[],
    xzxd:[],
    proimg:[],
    a:'',
    collImg:'../../icons/start.png',
    collText:'收藏',
    collNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.setData({
      pid:options.id
    })
    this.getDetails()
    let isIphoneX =app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    
  },
  // 收藏
  coll:function(){
    let that = this
    let collected = that.data.details.is_collected
    // console.log(collected)
    if(that.data.token == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function(){

        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
      return false;
    }else{
      wx.request({
        url: app.interfaceUrl+'user/collect',
        data: {
          token:that.data.token,
          pid:that.data.pid
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res.data.code == 200){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            if(res.data.msg == '已取消收藏'){
              that.setData({
                collImg:'../../icons/start.png',
                collText:'收藏',
              })
            }else{
              that.setData({
                collImg:'../../icons/or-start.png',
                collText:'已收藏',
              })
            }
          
          }
        },
      })
    }
  },

  // 跳转客服
  kf:function(){
    let that = this
    wx.navigateTo({
      url: '../skip/skip',
    })
  },

  // 转义
  a:function(){
    var zy = this.data.details.pro_content
    var zyf = underscore.unescape(zy)
    this.setData({
      a:zyf
    })
  },

  // 拼接传下一个页面
  sd:function(){
    let that = this
    var de = this.data.details
    var arr = this.data.sd
    var xzxd = this.data.xzxd
    let dx = {
      pro_thumb:de.pro_thumb,
      pro_title:de.pro_title,
      p_type:that.data.xzfs,
      p_price:de.price,
      p_count:that.data.num,
      service_fee:de.service_fee,
      postage:de.postage,
      pro_expense:de.pro_expense,
      a:1,
      c:1
    }
    console.log(dx)
    let xzx= {
      pid:de.id,
      pay:that.data.xzfs,
      nums:that.data.num
    }
    arr.push(dx)
    xzxd.push(xzx)
    this.setData({
      sd:arr,
      qian:that.data.details.price*that.data.num,
      xzxd:xzxd
    })
    if(that.data.token == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function(){

        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
      return false;
    }else{

      wx.navigateTo({
        url: '../order/order?sd='+JSON.stringify(that.data.sd)+'&qian='+that.data.qian+'&xzxd='+JSON.stringify(that.data.xzxd),
        success:function(res){
          that.setData({
            sd:[],
            xzxd:[]
          })
          console.log('成功')
        }
      })
    }
    console.log(this.data.qian)
  },

  // 获取产品详情
  getDetails:function(){
    let that = this
    let token = wx.getStorageSync('token');
    // console.log(token)
    wx.request({
      url: app.interfaceUrl+'pro/info',
      data: {
        pid:that.data.pid,
        token:token
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res)
        that.setData({
          details:res.data.data,
          token:token,
          proimg:res.data.data.proimg
        })
        // console.log(that.data.details.is_collected)
        if(that.data.details.is_collected == 1){
          that.setData({
            collImg:'../../icons/or-start.png',
            collText:'已收藏',
          })
        }else{
          that.setData({
            collImg:'../../icons/start.png',
            collText:'收藏',
          })
        }
        console.log(that.data.details)
        that.a()
      }
    })
  },

  // 点击切换
  bar:function(e){
    var index = e.target.dataset.current
    this.setData({
      current:index
    })
  },

  // 选择购买方式
  xzfs:function(e){
    var index = e.target.dataset.index;
    this.setData({
      xzfs:index
    })
  },

  // 购物数量
  jjsl:function(e){
    var num = e.detail.value
    this.setData({
      num:num
    })
  },
  jian:function(){
    let that = this
    var num = this.data.num
    if(num == 1){
      num--
      that.data.num = 1
    }else{
      num--
      that.data.num = num
    }
    this.setData({
      num:this.data.num
    })
  },
  jia:function(){
    let that = this
    var num = this.data.num
    if(num == 999){
      num++
      that.data.num = 999
    }else{
      num++
      that.data.num = num
    }
    this.setData({
      num:this.data.num
    })
  },

  // 关闭弹窗
  close:function(){
    this.setData({
      all:1,
      fw:1,
      cs:1,
      gg:1,
      num:1,
    })
  },
  fwsm:function(){
    this.setData({
      all:0,
      fw:0,
    })
  },
  spcs:function(){
    this.setData({
      all:0,
      cs:0,
    })
  },
  spgg:function(){
    this.setData({
      all:0,
      gg:0,
    })
  },

  // 添加购物车
  addCar:function(){
    let that = this
    console.log(this.data.token)
    if(that.data.token == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function(){

        wx.navigateTo({
          url: '../login/login',
        })
      },1000)
      return false;
    }else{

      wx.request({
        url: app.interfaceUrl+'cart/add',
        data: {
          pid:that.data.pid,
          p_type:that.data.xzfs,
          'token':that.data.token,
          p_count:that.data.num
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          console.log(res)
          that.setData({
            add:0,
            msg:res.data.msg
          })
         
        },
        complete: function() {
          // complete
          wx.setStorage({
            key: 'is_change',
            data: '0',
            })
          setTimeout(function(){
            that.setData({
              add:1
            })
          },2000)
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