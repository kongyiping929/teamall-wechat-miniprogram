//app.js
const ajax = require('assets/js/ajax.js');
App({
  onLaunch: function () {
    console.log(this.globalData)
    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
      }
    })
    
  },
  globalData: {
    userInfo: null,
    
  }
})