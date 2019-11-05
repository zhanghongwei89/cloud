// pages/shop/shop.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    token:'',
    product:[],
    url:'http://www.mypalmcloud.com/attachment/',
    aa:1,
    bb:6,
    // 价格排序
    pri:0,
    priSort:'desc',
    // 价格val
    priProduct:[],
    priProductnew:[],
    priProductnC:[],
    imgUrl:'../../icons/jiage.png',
    screend:[],
    isSelect:true,
    a:'',
    b:'',
    c:'',
    d:'',
    str:[],
    strb:[],
    strc:[],
    strd:[],
    wsj:null
  },
  // 选项卡切换
  tabNav: function (e) {
    let that = this
    var current = e.target.dataset.current
    this.setData({
      currentTab:current,
     });
     if(that.data.currentTab == 1){
       that.setData({
        pri:that.data.pri+1
       })
       if(that.data.pri%2 == 0){
        //  1的时候为价钱倒叙
        that.setData({
          priSort:'desc',
          imgUrl:'../../icons/jiage-show-down.png'
        })
        wx.request({
          url: app.interfaceUrl+'product?p=1&ps=6',
          data: {
            desc:that.data.priSort,
            // p: that.data.aa,
            ps: that.data.bb,
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // console.log(res)
            that.setData({
              priProduct:res.data.product,
            })
          }
        })
       }else{
        //  0的时候为价钱正序
        that.setData({
          priSort:'asc',
          imgUrl:'../../icons/jiage-show-up.png'
        })
        wx.request({
          url: app.interfaceUrl+'product?p=1&ps=6',
          data: {
            desc:that.data.priSort,
            // p: that.data.aa,
            ps: that.data.bb,
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // console.log(res)
            that.setData({
              priProduct:res.data.product,
            })
          }
        })
       }
       

     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommodity()
  },
  
  
  // 获取商品列表
  getCommodity:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'product?p='+that.data.aa+'&ps=6',
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        that.setData({
          product:res.data.product,
        })
      }
    })
  },
  
  // 筛选
  getScreen:function(){
    let that = this
    wx.request({
      url: app.interfaceUrl+'parameter',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // console.log(res.data.date)
        that.setData({
          screend:res.data.date
        })
      }
    })
  },

  //筛选按钮  
  selectApply:function(e){
    let that = this
    var findex = e.currentTarget.dataset.index;
    var index = e.currentTarget.dataset.zi;
    var item = this.data.screend[findex].date[index]
    if(item.param_name == 'brand_id'&&item.isSelect == 'false'||item.param_name == 'brand_id'&&item.isSelect == true){
      that.data.str.push(item.id)
      console.log(that.data.str)
    }
    else if(item.param_name == 'brand_id'&&item.isSelect == false){
      var u = that.data.str.indexOf(item.id)
      var sc = that.data.str
      sc.splice(u,1)
      
    }
    
    if(item.param_name == 'model_id'&&item.isSelect == 'false'||item.param_name == 'model_id'&&item.isSelect == true){
      that.data.strb.push(item.id)
      console.log(that.data.strb)
    }
    else if(item.param_name == 'model_id'&&item.isSelect == false){
      var ub = that.data.strb.indexOf(item.id)
      var scb = that.data.strb
      scb.splice(ub,1)
      
    }
    if(item.param_name == 'hash'&&item.isSelect == 'false'||item.param_name == 'hash'&&item.isSelect == true){
      that.data.strc.push(item.name)
      console.log(that.data.strc)
    }
    else if(item.param_name == 'hash'&&item.isSelect == false){
      var uc = that.data.strc.indexOf(item.name)
      var scc = that.data.strc
      scc.splice(uc,1)
      
    }
    if(item.param_name == 'graphics_card'&&item.isSelect == 'false'||item.param_name == 'graphics_card'&&item.isSelect == true){
      that.data.strd.push(item.name)
      console.log(that.data.strd)
    }
    else if(item.param_name == 'graphics_card'&&item.isSelect == false){
      var ud = that.data.strd.indexOf(item.name)
      var scd = that.data.strd
      scd.splice(ud,1)
      
    }
    console.log(item.isSelect)
    console.log(item.param_name)
    // console.log(that.data.strb)
    // console.log(that.data.strc)
    // console.log(that.data.strd)
    item.isSelect = !item.isSelect;
    this.setData({
      screend: that.data.screend,
      a:that.data.str.toString(),
      b:that.data.strb.toString(),
      c:that.data.strc.toString(),
      d:that.data.strd.toString(),
    });
  },

  //重置
  res:function(){
    let that = this
    let isSelect = this.data.isSelect
    let cars= this.data.screend
    for(var i=0;i<cars.length;i++){
      // console.log(cars[i])
      for(var j=0;j<cars[i].date.length;j++){
        // console.log(cars[i].date[j])
        cars[i].date[j].isSelect = isSelect
      }
    }
    
    this.setData({
      screend:cars,
      str:[],
      strb:[],
      strc:[],
      strd:[],
      a:'',
      b:'',
      c:'',
      d:'',
    })
  },

  // 提交
  qr:function(){
    let that = this
    var zz = {}
    if (that.data.a.length>0){
      zz['brand_id[]'] = that.data.a
    }
    if(that.data.b.length>0){
      zz['model_id[]'] = that.data.b
    }
    if(that.data.c.length>0){
      zz['hash[]'] = that.data.c
    }
    if(that.data.d.length>0){
      zz['graphics_card[]'] = that.data.d
    }
    // console.log(that.data.a)
    // console.log(that.data.b)
    // console.log(that.data.c)
    // console.log(that.data.d)
    wx.request({
      url: app.interfaceUrl+'condition',
      data: zz,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
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
    var that = this;
    that.setData({
      token : app.globalData.token
    })
    // this.getCommodity()
    // console.log(app.globalData.token)
    this.getScreen()
    
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
    let priProduct = that.data.priProduct
    let product = that.data.product
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      aa:that.data.aa+1,
      bb:that.data.bb+6,
    })
    if(that.data.wsj == 0){
      wx.showToast({
        title: '暂无更多',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else{
      wx.request({
        url: app.interfaceUrl+'product',
        data: {       
           p: that.data.aa,
           ps:6,
           desc:that.data.priSort,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json;application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        success: function (res) {
        
        that.setData({
          wsj:res.data.product.length
        })
        // console.log(res.data.product)
        // 人气
          if (res.data.product.length == 0) {
            wx.showLoading({
              title: '加载完毕',
            })
            // console.log('加载完毕')
            return false
           
          } else if (res.data.product.length != 0) {
            //组合获取的数据
            for (var i = 0; i < res.data.product.length; i++) {
             
              product.push(res.data.product[i])
              priProduct.push(res.data.product[i])
            } 
            
             //往前台传递数据
            that.setData({          
              product: product,
              priProduct: priProduct,
            })
            // console.log(that.data.product)
          }
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