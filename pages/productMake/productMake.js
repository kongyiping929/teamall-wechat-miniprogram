// pages/productType/productType.js
const ajax = require('../../assets/js/ajax.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,//1:产品分类 2:微广场
    list:''
  },

  // 跳转
  goProductPlaza(e) {
    wx.navigateTo({ url: '/pages/productPlaza/productPlaza?id=' + e.currentTarget.dataset.id })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ type: options.type });
    this.init()
    console.log(this.data.list)
  },
  // 初始化
  init() {
    let { type } = this.data;
    let that = this;
    let url = "/app/microSquare/findMicroSquareList"
    ajax.post(url,{})
      .then(res => {
        this.setData({ list: res.data.list });
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