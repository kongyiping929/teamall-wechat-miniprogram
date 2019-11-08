// pages/getUserInfo/getUserInfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onGotUserInfo: function (e) {
    if (e.detail.errMsg === 'getUserInfo:ok' && e.detail.userInfo) {
      wx.getUserInfo({
        success: response => {
          console.log(response)
          const { iv, encryptedData } = response
          wx.request({
            url: 'http://119.23.79.12:7001/cy'+'/app/common/wxlogin' ,
            data: { code: app.globalData.code, userInfo: encryptedData, iv },
            method: 'POST',
            success(res) {
              console.log(res)
              app.globalData.TOKEN = res.data.responseBody.data.loginToken;
              wx.reLaunch({ url: '/pages/index/index' });
            }
          })
        }})
      // app.globalData.userInfo = e.detail.userInfo;
      // if (app.globalData.phoneFlag) {
      //   if (app.globalData.shareUrl) {
      //     wx.switchTab({ url: app.globalData.shareUrl });
      //   } else {
      //     wx.switchTab({ url: '/pages/index/index' });
      //   }
      // }
      
      // if (app.globalData.shareUrl.indexOf('index') > 0) {
      //   wx.switchTab({ url: app.globalData.shareUrl });
      // }
      // if (app.globalData.shareUrl.indexOf('obtainVoucher') > 0 || app.globalData.shareUrl.indexOf('productDetails') > 0) {
      //   wx.reLaunch({ url: app.globalData.shareUrl });
      // }
    } else {
      wx.showToast({
        title: '获取信息失败，请允许获取完成注册',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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