App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // let that = this
    
  },

 

  globalData: {
    token:'',
    address:undefined,
    isIphonex:false,
    phoneIv:'',
    phoneEn:'',
    // code:'',
    iv:'',
    encryptedData:'',
    nikeName:'',
    user:''
  },
  interfaceUrl:"https://api.mypalmtech.cn/api/",//正式
  // interfaceUrl:"http://192.168.31.190:80/api/",//测试


  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    // console.log(this.globalData.token)
    let _self = this;

    wx.getSystemInfo({
      success: res =>{
        let modelmes = res.model;
        if(modelmes.search('iPhone X') != -1){
            _self.globalData.isIphoneX = true
        }
      }
    })

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
