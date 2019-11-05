// pages/time/time.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:undefined,
    // stamp:undefined,
    // countDownNum:undefined,
    timer:'',
    jgdjs_jo:{hour:'00',min:'00',sec:'00'},
    token:'',
    timeStamp:'',
    nonceStr:'',
    package:'',
    paySign:'',
    order:'',
    creattime:'',
    total:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.order){
      this.setData({
        time:JSON.parse(options.time)
      })
    }else{
      this.setData({
        order:options.order,
        creattime:options.time,
        total:options.total,
      })
    }
    this.setData({
      token:app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    // console.log(this.data.total)
    // console.log(wx.getStorageSync('token'))
    this.countDown()
    
  },

  // 倒计时
  countDown: function() {
    let that = this
    if(!that.data.creattime){
      var creat = that.data.time.date
    }else{
      var creat = that.data.creattime
    }
    // var c = Date.parse(new Date())/1000
    // console.log('现在时间戳'+c)
    // console.log('下单时间戳'+creat)
    that.setData({
      timer:setInterval(function(){
        var lefttime = parseInt((parseInt(creat)+1800-Date.parse(new Date())/1000)*1000)
        // debugger
        // console.log(lefttime)
        // console.log(parseInt(creat)+1800)
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

  // 支付
  zf:function(){
    let that = this
    if(that.data.total == ''){
      var tot = that.data.time.total_fee
    }else{
      var tot = that.data.total
    }
    // console.log(tot)
    if(!that.data.order){
      var ordersn = that.data.time.order_numbers
    }else{
      var ordersn = that.data.order
    }
    wx.request({
      url: app.interfaceUrl+'wxpay',
      data: {
        token:wx.getStorageSync('token'),
        ordersn:ordersn
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        that.setData({
          timeStamp:res.data.timestamp,
          nonceStr:res.data.nonceStr,
          package:res.data.package,
          paySign:res.data.paySign,
        })
        if(res.statusCode == 200){
          wx.requestPayment({
            timeStamp: that.data.timeStamp,
            nonceStr: that.data.nonceStr,
            package: that.data.package,
            signType: 'MD5',
            paySign: that.data.paySign,
            success: function(res){
              // success
              console.log(res)
              console.log('支付成功');
              if (res.errMsg == 'requestPayment:ok') {
                wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    success:function(res){
                      if(res.confirm){
                        wx.reLaunch({
                          url:'../sucpayment/sucpayment'
                        })
                      }
                    }
                });
              }
            },
            fail: function() {
              // fail
              console.log(res)
              console.log('支付失败');
                wx.showModal({
                  title: '提示',
                  content: '充值失败',
                  success:function(res){
                       wx.reLaunch({
                        url:'../faipayment/faipayment?order='+that.data.time.order_numbers+'&tot='+tot
                    })
                  }
                });
              return;
            },
            complete: function() {
              // complete
              // console.log(res)
              // console.log('支付完成');
              
            }
          })
        }
        // console.log(res)
        // console.log(res.data.timestamp)
        // console.log(that.data.timeStamp)
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
    // var a = this.data.time.date+3600-this.data.time.date
    // var TIME = util.formatTime(new Date());
    // this.setData({
    //   stamp: TIME,
    //   countDownNum:a
    // });
    // var b = new Date(parseInt(this.data.time.date) * 1000+3600*1000) .toLocaleString() .replace(/:\d{1,2}$/, " "); 
    // var minutes = parseInt((a*1000 % (1000 * 60 * 60)) / (1000 * 60));
    // var seconds = parseInt((a*1000 % (1000 * 60)) / 1000);
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