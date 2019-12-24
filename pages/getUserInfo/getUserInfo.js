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
          console.log(app.globalData.code,response)
          const { iv, encryptedData } = response;
          let parame = { 
            code: app.globalData.code, 
            userInfo: encryptedData, 
            iv ,
            shopId: app.globalData.shopId ? app.globalData.shopId:"",
            inviteCode: app.globalData.inviteCode,
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude,
          }
          wx.request({
            url: 'http://119.23.79.12:7001/cy'+'/app/common/wxlogin' ,
            data: parame,
            method: 'POST',
            success(res) {
              wx.setStorageSync('TOKEN', res.data.responseBody.data.loginToken)
              wx.setStorageSync('OPENID', res.data.responseBody.data.openid)
              wx.setStorageSync('SHOP', res.data.responseBody.data.shop)
              app.globalData.shopId = res.data.responseBody.data.shop.shopId;
              app.globalData.shop = res.data.responseBody.data.shop;
              if (app.globalData.inviteCode) {
                wx.navigateBack({
                  delta:1
                })
              } else {
                wx.switchTab({ url: '/pages/index/index' });
              }
            }
          })
        }})
    } else {
      wx.showToast({
        title: '获取信息失败，请允许获取用户信息',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading();
    wx.getLocation({
      success(res) {
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
        wx.setStorageSync('latitude', res.latitude)
        wx.setStorageSync('longitude', res.longitude)
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