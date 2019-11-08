// pages/queryUsers/queryUsers.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '1', // 1 定向开单 2 定向邀请/预定
    keyword: '', // 搜索字段
    list:''
  },

  // 更改搜索字段值
  changeKeyword(e) {
    this.setData({ keyword: e.detail.value });
  },

  // 选择产品
  selectProduct(e) {
    wx.navigateTo({ url: `/pages/userSelectProduct/userSelectProduct?type=${this.data.type}` });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ type: options.type });
  },

  select() {
    let that = this;
    const { keyword } =this.data
    ajax.post('/app/user/manage/getcustomer', { keyword, shopId: app.globalData.shopId || 1 })
      .then(res => {
        console.log(res)
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