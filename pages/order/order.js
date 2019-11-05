// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tap:1,
    mengShow:false,
    duImg:'../../icons/d.png',
    xxsm:'详细说明',
    isSelect:false,
    token:'',
    xd:undefined,
    sd:undefined,
    arr:[],
    brr:[],
    url:'http://www.mypalmcloud.com/attachment/',
    totalMoney:0,
    show:false,
    service_fee:0,
    postage:0,
    nodiscount:0,
    xzxd:undefined,
    address:[],
    msg:'',
    tips:0,
    time:undefined,
    pro_expense:0,
    buttonClicked: false,
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
    if(options.xd !== undefined){
      this.setData({
        xd:JSON.parse(options.xd),
        totalMoney:options.qian,
        xzxd:JSON.parse(options.xzxd)
      })
      this.arr()
    }else{
      this.setData({
        totalMoney:options.qian,
        sd:JSON.parse(options.sd),
        xzxd:JSON.parse(options.xzxd)
      })
      this.brr()
    }
    // console.log(JSON.parse(options.xzxd))
    // console.log(JSON.parse(options.sd))
    // console.log(options.qian)
    
    this.addShow()
    let isIphoneX =app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
  },

  // 获取地址
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
        // success
        var is_default = res.data.data[0]
        that.setData({
          address:is_default
        })
        console.log(that.data.address)
      }
    })
  },

  // 拿到购物车数据从新拼接
  arr:function(){
    var arr = this.data.arr
    var xd = this.data.xd
    for(var i=0;i<xd.length;i++){
      var newArr = {
        pro_thumb:xd[i].pro.pro_thumb,
        pro_title:xd[i].pro.pro_title,
        p_type:xd[i].p_type,
        p_price:xd[i].p_price,
        p_count:xd[i].p_count,
        service_fee:xd[i].pro.service_fee,
        postage:xd[i].pro.postage,
        pro_expense:xd[i].pro_expense,
        a:1,
        c:1
      }
      arr.push(newArr)
    }
    this.setData({
      arr:arr
    })
    console.log(this.data.arr)
  },

  // 拿到商品详情数据
  brr:function(){
    var arr = this.data.arr
    var sd = this.data.sd
    this.setData({
      arr:sd
    })
    // console.log(this.data.brr)
  },

  // 详情显示隐藏
  details:function(e){
    let that =this
    var tap = this.data.tap
    var index = e.currentTarget.dataset.index
    var cartItems = this.data.arr;
    var num = cartItems[index].a
    var count = cartItems[index].c
    num++
    cartItems[index].a = num
    
    if(num%2 == 0){
      cartItems[index].c = 2
    }else{
      cartItems[index].c = 1
    }
    this.setData({
      arr:cartItems
    })
  },
  showMeng:function(e){ 
    this.setData({
      mengShow:true, 
      duImg:'../../icons/u.png',
      xxsm:'收起说明'
    })
  },
  outbtn:function(e){ 
    var that=this;
    this.setData({
      mengShow: false,
      duImg:'../../icons/d.png',
      xxsm:'详细说明'
    })
  },
  inbtn:function(e){     
    console.log("in")
  },

  // 显示地址元素区和计算价钱
  addShow:function(){
    let that = this
    var showxd = this.data.arr
    var num = 0
    var count = 0
    showxd.forEach(item => {
      if('p_type' in item == true){
        if(item.p_type == '2'){
          num += parseInt(item.p_count*(item.postage+item.service_fee))
          count = num + parseInt(that.data.totalMoney)
          // console.log(num)
          // console.log(count)
          that.setData({
            show:true,
            postage:item.postage,
            service_fee:item.service_fee,
            nodiscount:count
          })
        }
      }
    });
  },
  
  //选中未选中
  xz:function(){
    let isSelect = this.data.isSelect
    isSelect = !isSelect
    this.setData({
      isSelect:isSelect
    })
  }, 

  // 提交订单
  sub:function(){
    let that = this
    var array = this.data.xzxd
    this.setData({
      buttonClicked: true,
    })
    if(this.data.isSelect == true){
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        buttonClicked: false,
      })
      return false
    }
    if(this.data.address == undefined){
      var aid = ''
    }else{
      var aid = this.data.address.aid
    }
    console.log(aid)
    wx.request({
      url: app.interfaceUrl+'Confirmorder',
      data: {
        token:wx.getStorageSync('token'),
        array:JSON.stringify(array),
        address_id:aid,
        source:2
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        if(res.data.code == 201){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            buttonClicked: false,
          })
          return false
        }
        if(res.data.code == 200){
          that.setData({
            msg:res.data.msg,
            tips:1,
            time:res.data.data
          })
        }
      },
      fail: function(res) {
        // fail
        // wx.showToast({
        //   title: '请填写默认地址',
        //   icon: 'none',
        //   duration: 2000
        // })
        // return false
      },
      complete: function(res) {
        console.log(res)
        if(res.data.code == 201){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            buttonClicked: false,
          })
          return false
        }
        if(res.data.code == 401){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          return false
        }else{
          wx.setStorage({
            key: 'is_change',
            data: '0',
            })
          setTimeout(function(){
            that.setData({
              msg:'',
              tips:0,
              buttonClicked: false
            })
            wx.navigateTo({
              url: '../time/time?time='+JSON.stringify(that.data.time),
            })
          },2000)
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