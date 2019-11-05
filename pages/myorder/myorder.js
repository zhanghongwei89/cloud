// pages/myorder/myorder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    token:'',
    orccc:'',
    orblue:'',
    data:[],
    url:'http://www.mypalmcloud.com/attachment/',
    p:1,
    ps:5,
    dfk:[],
    dsh:[],
    ywc:[],
    yqx:[],
    qian:0,
    sd:[],
    xzxd:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentTab:options.a
    })
    this.setData({
      token:app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    
  },

  // 切换导航栏
  tabNav:function(e){
    var current = e.currentTarget.dataset.current
    this.setData({
      currentTab:current
    })
  },

  // 获取订单
  getOrderAll:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'order/list',
      data: {
        p:1,
        ps:5,
        token: wx.getStorageSync('token'),
        status:'',
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res.data.data)
        that.setData({
          data:res.data.data
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
  // 获取代付款订单
  getOrderDfk:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'order/list',
      data: {
        p:1,
        ps:5,
        token: wx.getStorageSync('token'),
        status:0,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res.data.data)
        that.setData({
          dfk:res.data.data
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
  // 获取代收货订单
  getOrderDsh:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'order/list',
      data: {
        p:1,
        ps:5,
        token: wx.getStorageSync('token'),
        status:2,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res.data.data)
        that.setData({
          dsh:res.data.data
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
  // 获取已完成订单
  getOrderYwc:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'order/list',
      data: {
        p:1,
        ps:5,
        token: wx.getStorageSync('token'),
        status:3,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res.data.data)
        that.setData({
          ywc:res.data.data
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
  // 获取已取消订单
  getOrderYqx:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'order/list',
      data: {
        p:1,
        ps:5,
        token: wx.getStorageSync('token'),
        status:4,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        // console.log(res.data.data)
        that.setData({
          yqx:res.data.data
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
  dfkdet:function(e){
    let that =this
    var index = e.currentTarget.dataset.index
    if(that.data.currentTab == 0){
      var dfk = this.data.data
    }else if(that.data.currentTab == 1){
      var dfk = this.data.dfk
    }else if(that.data.currentTab == 2){
      var dfk = this.data.dsh
    }else if(that.data.currentTab == 3){
      var dfk = this.data.ywc
    }else if(that.data.currentTab == 4){
      var dfk = this.data.yqx
    }
    var idx = dfk[index]
    var order = idx.ordersn
    // console.log(idx)
    wx.navigateTo({
      url: '../orderDetails/orderDetails?order='+order,
    })
  },

  // 立即付款
  nowfk:function(e){
    let that = this
    var index= e.currentTarget.dataset.fk
    if(that.data.currentTab == 0){
      var dfk = this.data.data
    }else if(that.data.currentTab == 1){
      var dfk = this.data.dfk
    }
    var idx = dfk[index]
    var order = idx.ordersn
    var ceatetime = idx.create_timestamp
    var total_fee = idx.total_fee
    console.log(idx)
    wx.navigateTo({
      url: '../time/time?order='+order+'&time='+ceatetime+'&total='+total_fee,
    })
  },

  // 再次购买
  again:function(e){
    let that = this
    var index= e.currentTarget.dataset.ag
    if(that.data.currentTab == 0){
      var dfk = this.data.data
    }else if(that.data.currentTab == 3){
      var dfk = this.data.ywc
    }else if(that.data.currentTab == 4){
      var dfk = this.data.yqx
    }
    var idx = dfk[index]
    var order = idx.ordersn
    wx.request({
      url: app.interfaceUrl+'user/replay_order',
      data: {
        token:wx.getStorageSync('token'),
        ordersn:order
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
    let that = this
    var index= e.currentTarget.dataset.can
    var can = this.data.dfk
    var order = can[index].ordersn
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
         
          if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onShow()
          }
        },2000)
      }
      
    })
  },

  // 确认收货
  confirm:function(e){
    let that = this
    var index= e.currentTarget.dataset.con
    var can = this.data.dsh
    var order = can[index].ordersn
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
        setTimeout(function(){
          wx.showToast({
            title: '确认收货成功',
            icon: 'none',
            duration: 2000
          })
          if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onShow()
          }
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
    this.getOrderAll()
    this.getOrderDfk()
    this.getOrderDsh()
    this.getOrderYwc()
    this.getOrderYqx()
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
    wx.showLoading({
      title: '正在加载',
    })
    var ps = this.data.ps
    var p = this.data.p
    p+=1
    // ps+=5
    this.setData({
      p:p,
      // ps:ps
    })
    // 全部订单
    if(that.data.currentTab == 0){
      wx.request({
        url: app.interfaceUrl+'order/list',
        data: {
          p:p,
          ps:ps,
          token: wx.getStorageSync('token'),
          status:'',
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res.data.data.length == 0){
            wx.showLoading({
              title: '加载完毕',
            })
            return false
          }else if(res.data.data.length !== 0){
            for(var i=0;i<res.data.data.length;i++){
              that.data.data.push(res.data.data[i])
            }
            that.setData({
              data:that.data.data
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
    }
    // 代付款
    if(that.data.currentTab == 1){
      wx.request({
        url: app.interfaceUrl+'order/list',
        data: {
          p:p,
          ps:ps,
          token: wx.getStorageSync('token'),
          status:0,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res.data.data.length == 0){
            wx.showLoading({
              title: '加载完毕',
            })
            return false
          }else if(res.data.data.length !== 0){
            for(var i=0;i<res.data.data.length;i++){
              that.data.dfk.push(res.data.data[i])
            }
            that.setData({
              dfk:that.data.dfk
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
    }
    // 代收货
    if(that.data.currentTab == 2){
      wx.request({
        url: app.interfaceUrl+'order/list',
        data: {
          p:p,
          ps:ps,
          token: wx.getStorageSync('token'),
          status:2,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res.data.data.length == 0){
            wx.showLoading({
              title: '加载完毕',
            })
            return false
          }else if(res.data.data.length !== 0){
            for(var i=0;i<res.data.data.length;i++){
              that.data.dsh.push(res.data.data[i])
            }
            that.setData({
              dsh:that.data.dsh
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
    }
    // 已完成
    if(that.data.currentTab == 3){
      wx.request({
        url: app.interfaceUrl+'order/list',
        data: {
          p:p,
          ps:ps,
          token: wx.getStorageSync('token'),
          status:3,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res.data.data.length == 0){
            wx.showLoading({
              title: '加载完毕',
            })
            return false
          }else if(res.data.data.length !== 0){
            for(var i=0;i<res.data.data.length;i++){
              that.data.ywc.push(res.data.data[i])
            }
            that.setData({
              ywc:that.data.ywc
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
    }
    // 已取消
    if(that.data.currentTab == 4){
      wx.request({
        url: app.interfaceUrl+'order/list',
        data: {
          p:p,
          ps:ps,
          token: wx.getStorageSync('token'),
          status:4,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res.data.data.length == 0){
            wx.showLoading({
              title: '加载完毕',
            })
            return false
          }else if(res.data.data.length !== 0){
            for(var i=0;i<res.data.data.length;i++){
              that.data.yqx.push(res.data.data[i])
            }
            that.setData({
              yqx:that.data.yqx
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
    }
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