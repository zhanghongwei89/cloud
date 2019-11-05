// pages/faipayment/faipayment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    order:'',
    timeStamp:'',
    nonceStr:'',
    package:'',
    paySign:'',
    tot:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.tot)
    this.setData({
      order:options.order,
      tot:options.tot
    })
    this.setData({
      token:app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
  },

  // 跳转首页
  home:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },

  // 重新支付
  again:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'wxpay',
      data: {
        token:wx.getStorageSync('token'),
        ordersn:that.data.order
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
                    content: '充值成功',
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
                        url:'../faipayment/faipayment?order='+that.data.order
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