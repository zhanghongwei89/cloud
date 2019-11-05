const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_all:[],
    thumb:[],
    url:'http://www.mypalmcloud.com/attachment/',
    message:[],
    pro_data:[],
    page:1,
    wsj:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperImg()
  },

  // 获取轮播图图片和消息
  getSwiperImg:function(){
    let that = this
    wx.request({
      url: 'https://api.mypalmtech.cn/api/top?p=1&ps=6',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res)
        if(res.data.code == 200){
          console.log(res.data.data.message)
          that.setData({
            thumb:res.data.data.banner,
            message:res.data.data.message,
            pro_data:res.data.data.pro_data,
          })
        }
      }
    })
  },

  // 跳转消息详情
  mid:function(e){
    let mid = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../newsCoreNt/newsCoreNt?mid='+mid,
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
    //上拉加载
    wx.showLoading({
      title: '正在加载',
    })
 
    var that = this
    //加载次数加一
    this.setData({
      page:that.data.page+1
    })  
    console.log(that.data.pro_data)
    
    //从接口获取数据
    if(that.data.wsj == 0){
      wx.showToast({
        title: '暂无更多',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else{
      wx.request({
        url: 'https://api.mypalmtech.cn/api/top?p=1&ps=6',
        data: {       
          p: that.data.page,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json;application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        success: function (res) {
        console.log(res)
        that.setData({
          wsj:res.data.data.pro_data.length
        })
          if (res.data.data.pro_data.length == 0) {
            wx.showLoading({
              title: '加载完毕',
            })
            return false
           
          } else if (res.data.data.pro_data.length != 0) {
            
             //组合获取的数据
             for (var i = 0; i < res.data.data.pro_data.length; i++) {
             
              that.data.pro_data.push(res.data.data.pro_data[i])
            } 
            
             //往前台传递数据
            that.setData({          
              pro_data: that.data.pro_data
            })
            
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