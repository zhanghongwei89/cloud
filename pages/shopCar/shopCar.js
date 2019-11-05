// pages/shopCar/shopCar.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    token:'',
    url:'http://www.mypalmcloud.com/attachment/',
    delBtnWidth:160,
    data: [],
    isScroll:true,
    totalMoney: 0,
    totalCount: 0,
    selectAllStatus:false,//是否全选
    show:false,
    cid:[],
    p_type:null,
    msg:'',
    scts:1,
    xd:[],
    xzxd:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key: 'is_change',
      data: '0',
      })
      // console.log(wx.getStorageSync('is_change'))
    // this.getCar()
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    var that = this;
    that.setData({
      token : app.globalData.token
    })
    // wx.setStorageSync('token', app.globalData.token)
    
  },
  drawStart: function (e) {
    var touch = e.touches[0]
    for(var index in this.data.data) {
      var item = this.data.data[index]
      item.right = 0
    }
    this.setData({
      data: this.data.data,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.data[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX
    
    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        data: this.data.data
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data
      })
    }
  },  
  drawEnd: function (e) {
    var item = this.data.data[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth/2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    }
  },
  // 删除事件
  delItem: function (e) {
    let that = this
    var cartItems = this.data.data
    var del = e.currentTarget.dataset.index;
    var cc = that.data.data[del].cid
    var a = []
    a.push(cc)
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success:function(res){
        if(res.confirm){
          console.log(a)
          wx.request({
            url: app.interfaceUrl+'cart/del',
            data: {
              'token':wx.getStorageSync('token'),
              cid:a
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              // success
              console.log(res.data.msg)
              that.setData({
                msg:res.data.msg,
                scts:0
              })
              if (getCurrentPages().length != 0) {
                //刷新当前页面的数据
                getCurrentPages()[getCurrentPages().length - 1].onShow()
              }
              wx.setStorage({
                key: 'is_change',
                data: '0',
                })
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
                wx.setStorage({
                  key: 'is_change',
                  data: '0',
                  })
              },2000)
            }
          })
          if (cartItems.length) {
            that.setData({
              cartList: false
            });
          }
          wx.setStorageSync('data', cartItems)
        }
      }
    })
    
     
  },

  // 加减数量
  jian:function(e){
    let that =this
    var cartItems = this.data.data
    var jian = e.currentTarget.dataset.index;
    var num =cartItems[jian].p_count
    if(num == 1){
      num--
      cartItems[jian].p_count = 1
    }else{
      num--
      cartItems[jian].p_count = num
    }
    this.setData({
      data:cartItems
    })
    wx.setStorageSync('data', cartItems)
    this.getTotalPrice()
    wx.setStorage({
      key: 'is_change',
      data: '1',
      })
  },
  jia:function(e){
    let that =this
    var cartItems = this. data.data
    var jia = e.currentTarget.dataset.index;
    var num = cartItems[jia].p_count
    if(num == 999){
      num++
      cartItems[jia].p_count=999
    }else{
      num++
      cartItems[jia].p_count=num
    }
    this.setData({
      data:cartItems
    })
    wx.setStorageSync('data', cartItems)
    this.getTotalPrice()
    wx.setStorage({
      key: 'is_change',
      data: '1',
      })
  },
  jjSl:function(e){
    var cartItems = this. data.data
    var jiSl = e.currentTarget.dataset.index;
    var input = e.detail.value
    if(input == 1){
      cartItems[jiSl].p_count=1
    }else if(input >= 999){
      cartItems[jiSl].p_count=999
    }else{
      cartItems[jiSl].p_count=input
    }
    this.setData({
      data:cartItems
    })
    wx.setStorageSync('data', cartItems)
  },
  // 单选
  bindCheckbox:function(e){
    let that = this
    let idx = e.currentTarget.dataset.index;
    let carts = that.data.data;
    let isSelect1 = carts[idx].isSelect;
    carts[idx].isSelect = !isSelect1;
    let brr = that.data.xd
    let crr = that.data.xzxd
    that.setData({
      data: carts,
      selectAllStatus: false
    });
    // 选中的存到下单data里
    if(carts[idx].isSelect == true){
      brr.push(carts[idx])
      // console.log(carts[idx])
      that.setData({
        xd:brr,
      });
      // 这个存的是接口需要的
      let dx = {
        pid:carts[idx].pid,
        pay:carts[idx].p_type,
        nums:carts[idx].p_count
      }
      crr.push(dx)
      that.setData({
        xzxd:crr,
      });
    }
    if(carts[idx].isSelect == false){
      let iof = brr.indexOf(carts[idx])
      if(iof > -1){
        brr.splice(iof,1)
      }
      that.setData({
        xd:brr,
      })
      
      that.removeByValue(that.data.xzxd,'pid',carts[idx].pid)
      // console.log(iof)
      // console.log(that.data.xzxd)
      // console.log(carts[idx].isSelect)
    }
    wx.setStorage({
      key: 'is_change',
      data: '1',
      })
    wx.setStorageSync('data', carts)
    // console.log(wx.getStorageSync('data'))
    this.getTotalPrice()
  },
  // 方法删除接口需要的对象
  removeByValue: function(arr, attr, value) {  //数组，属性，属性值
    var index=0;
    for(var i in arr){
        if(arr[i][attr]==value){
            index=i;
            break;
        }
    }
    arr.splice(index,1);
  },    
  // 全选
  bindSelectAll:function(e){
    let that = this
    let selectedAllStatus = that.data.selectAllStatus;
    let carts = that.data.data;
    let brr = that.data.xzxd
    let crr = that.data.xd
    selectedAllStatus = !selectedAllStatus;
    brr.splice(0,carts.length)
    crr.splice(0,carts.length)
    for (var i = 0; i < carts.length; i++) {
      carts[i].isSelect = selectedAllStatus;
      if(selectedAllStatus == true){
        // that.setData({
        //   xd:carts,
        // });
        let xd={
          pid:carts[i].pid,
          pay:carts[i].p_type,
          nums:carts[i].p_count
        }
        
        brr.push(xd)
        crr.push(carts[i])
        // console.log(carts[0])
        that.setData({
          xzxd:brr,
          xd:crr
        });
        // console.log(that.data.xd)
      }else{
        that.setData({
          xd:[],
        });
        that.setData({
          xzxd:[],
        });
      }
    }
    that.setData({
      data: carts,
      selectAllStatus: selectedAllStatus
    });
    this.getTotalPrice()
  },

  // 计算价格
  getTotalPrice:function(){
    let carts = this.data.data;                  // 获取购物车列表
    let total = 0;
    let num = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].isSelect) {                   // 判断选中才会计算价格
        total += carts[i].p_count * carts[i].p_price;    // 所有价格加起来
        num += carts[i].num;
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      data: carts,
      totalCount: num,
      totalMoney: total.toFixed(2)
    });

  },

  // 去结算
  qjs:function(){
    let that = this
    // var arr= wx.getStorageSync('data')
    console.log(that.data.xd)
    console.log(that.data.xzxd)
    if(wx.getStorageSync('token') == ''){
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
    } 
    if(that.data.totalMoney == 0){
      wx.showToast({
        title: '请选择购物车商品',
        icon: 'none',
        duration: 2000
      })
      return ;
    }else{
      wx.navigateTo({
        url: '../order/order?xd='+JSON.stringify(that.data.xd)+'&qian='+that.data.totalMoney+'&xzxd='+JSON.stringify(that.data.xzxd),
      })
      setTimeout(function(){
        wx.setStorage({
          key: 'is_change',
          data: '0',
          })
        that.setData({
          xd:[],
          xzxd:[],
          totalMoney:0
        })
      },1000)
    }
  },

  //购物车获取
  getCar:function(options){
    let that = this
    // var token = that.data.token
    // let token = wx.getStorageSync('token');
    let token = wx.getStorageSync('token');
    console.log(token)
    let is_change =  wx.getStorageSync('is_change')
    // console.log(is_change)
    if(is_change == 0){
      wx.request({
        url: app.interfaceUrl+'cart/list',
        data: {
          'token':token
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // console.log(res.data.data)
          // console.log(res.data.data[1].p_count)
          that.setData({
            data:res.data.data
          })
        }
      })
    }
  },

  // 购物车详情
  details:function(e){
    let that = this
    var xq = e.currentTarget.dataset.index;
    var qx = this.data.data[xq]
    this.setData({
      show:true,
      cid:qx
    })
  },
  // 显示隐藏
  yc:function(){
    // var cid = wx.getStorageSync('data')
    this.setData({
      show:false,
      // data:cid
    })
  },
  // 确认发送
  confirm:function(){
    var data = this.data.data
    this.setData({
      show:false,
      data:data,
    })
    
  },
  // 购物详情加减
  // 加
  plus:function(){
    let that = this
    var cartItems = this.data.cid
    var num = cartItems.p_count
    console.log(num)
    if(num == 1){
      num--
      cartItems.p_count = 1
    }else{
      num--
      cartItems.p_count = num
    }
    this.setData({
      cid:cartItems
    })

  },
  // 减
  reduce:function(){
    let that = this
    var cartItems = this.data.cid
    var num = cartItems.p_count
    console.log(num)
    if(num == 999){
      num++
      cartItems.p_count = 999
    }else{
      num++
      cartItems.p_count = num
    }
    this.setData({
      cid:cartItems
    })

  },
  bluebar:function(e){
    var blue = e.target.dataset.blue
    var cartItems = this.data.cid
    cartItems.p_type = blue
    
    this.setData({
      cid:cartItems
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
  onShow: function (options) {
    // console.log(wx.getStorageSync('data').length)
    // console.log(this.data.data.length)
    // if(this.data.data.length!=this.data.data.length){
    //   this.onLoad()
    // }else if(this.data.data.length!=wx.getStorageSync('data').length){
    //   this.onLoad()
    // }
    this.getCar()
    // var that = this;
    // that.setData({
    //   token : app.globalData.token
    // })
    // wx.setStorageSync('token', app.globalData.token)
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