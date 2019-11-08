// pages/productType/productType.js
const ajax = require('../../assets/js/ajax.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:''
  },

  // 跳转产品微广场
  goProductPlaza(e) {
    wx.navigateTo({ url: '/pages/productPlaza/productPlaza?id=' + e.currentTarget.dataset.id })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  // 初始化
  init() {
    let { cityName } = this.data;
    let that = this;
    ajax.post('/app/index/findProductTypeList')
      .then(res => {
        this.setData({ list: res.data });
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