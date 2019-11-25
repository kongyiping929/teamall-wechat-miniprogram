// pages/userSelectProduct/userSelectProduct.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '1', // 1 定向开单 2 定向邀请/预定
    list: ""
  },

  // 初始化
  init() {
    let that = this;
    ajax.post('/app/user/manage/getproduct', {
        shopId: "1197444188149604353"
      })
      .then(res => {
        that.setData({
          list: res.data.list,
        })
      })

  },

  goOrder() { 
    wx.navigateTo({
      url: 'pages/backConfirmOrder/backConfirmOrder',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type,
      userId: options.userId 
    });
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})