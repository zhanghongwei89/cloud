// pages/orderDetails/orderDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:'',
    token:'',
    data:[],
    address:undefined,
    url:'http://www.mypalmcloud.com/attachment/',
    createtime:null,
    timer:'',
    jgdjs_jo:{hour:'00',min:'00',sec:'00'},
    qian:0,
    sd:[],
    xzxd:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order:options.order
    })
    this.setData({
      token:app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    this.getOrder()
    // this.countDown()
    let isIphoneX =app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
  },

  // 获取订单号
  getOrder:function(){
    let that =this
    wx.request({
      url: app.interfaceUrl+'order/info',
      data: {
        token:wx.getStorageSync('token'),
        ordersn:that.data.order
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // var a = new Date(res.data.data.createtime).getTime()
        var a = res.data.data.create_timestamp
        console.log(res)
        that.setData({
          data:res.data.data,
          address:Object.keys(res.data.data.address),
          createtime:a,
        })
        // console.log('现在时间戳'+Date.parse(new Date())/1000)
        // console.log('下单时间戳'+Date.parse(new Date())/1000)
        that.countDown()
      }
    })
  },

  // 倒计时
  countDown: function() {
    let that = this
    var createtime = this.data.createtime
    // console.log(this.data)
    // console.log('倒计时里下单时间'+createtime)
    // console.log('倒计时里现在时间'+Date.parse(new Date())/1000)
    that.setData({
      timer:setInterval(function(){
        var lefttime = parseInt((createtime+1800-(Date.parse(new Date())/1000))*1000)
        // console.log(lefttime)
        if(lefttime<=0){
          that.setData({
            jgdjs_jo:{hour:'00',min:'00',sec:'00'}
          })
          clearInterval(that.data.timer)
          return;
        }
        var h =parseInt(lefttime / 1000 / 3600 % 24)
        var m =parseInt(lefttime / 1000 / 60 % 60)
        var s =parseInt(lefttime / 1000 % 60)
        h = h<10?h='0'+h:h;
        m = m<10?m='0'+m:m;
        s = s<10?s='0'+s:s;
        that.setData({
          jgdjs_jo:{hour:h,min:m,sec:s}
        })
      },1000)
    })
  },

  // 立即付款
  qfk:function(){
    var createtime = this.data.createtime
    var total_fee = this.data.data.total_fee
    var ordersn = this.data.data.ordersn
    console.log(ordersn)
    wx.navigateTo({
      url: '../time/time?order='+ordersn+'&time='+createtime+'&total='+total_fee,
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

  // 再次购买
  again:function(){
    let that = this
    var ordersn = this.data.data.ordersn
    wx.request({
      url: app.interfaceUrl+'user/replay_order',
      data: {
        token:wx.getStorageSync('token'),
        ordersn:ordersn
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res.data.data)
        var de = res.data.data.pro
        var arr = that.data.sd
        var xzxd = that.data.xzxd
        var qian = that.data.qian
        for(var i = 0; i<de.length;i++){
          var dx = {
            pro_thumb:de[i].pro_thumb,
            pro_title:de[i].pro_title,
            p_type:de[i].p_type,
            p_price:de[i].price_dis,
            p_count:de[i].o_num,
            service_fee:de[i].service_fee,
            postage:de[i].postage,
            pro_expense:de[i].pro_expense,
            a:1,
            c:1
          }
          var xzx= {
            pid:de[i].id,
            pay:de[i].p_type,
            nums:de[i].o_num
          }
          arr.push(dx)
          xzxd.push(xzx)
          qian += de[i].price_dis*de[i].o_num,
          that.setData({
            sd:arr,
            qian:qian,
            xzxd:xzxd
          })
        }
        wx.navigateTo({
          url: '../order/order?sd='+JSON.stringify(that.data.sd)+'&qian='+that.data.qian+'&xzxd='+JSON.stringify(that.data.xzxd),
          success:function(res){
            that.setData({
              sd:[],
              xzxd:[],
              qian:0
            })
            console.log('成功')
          }
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

  // 取消订单
  cancel:function(e){
    var order = this.data.data.ordersn
    console.log(order)
    wx.request({
      url: app.interfaceUrl+'order/updstatus',
      data: {
        token:wx.getStorageSync('token'),
        ordersn:order,
        status:4
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
      },
      complete: function() {
        wx.showToast({
          title: '取消订单成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },2000)
      }
      
    })
  },

  // 确认收货
  confirm:function(e){
    var order = this.data.data.ordersn
    console.log(order)
    wx.request({
      url: app.interfaceUrl+'order/updstatus',
      data: {
        token:wx.getStorageSync('token'),
        ordersn:order,
        status:3
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
      },
      complete: function() {
        wx.showToast({
          title: '确认成功',
          icon: 'none ',
          duration: 2000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },2000)
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