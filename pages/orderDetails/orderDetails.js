// pages/orderDetails/orderDetails.js
const orderStatusList = ['', '待支付', '待发货', '卖家已发货', '交易成功', '退货申请中', '退款成功', '退款失败'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatusList, // 订单状态列表
    status: '0', // 订单状态 1 待支付 2 待发货 3 卖家已发货 4 交易成功 5 退货申请中 6 退款成功 7 退款失败
    service: false, // 客服模态框
  },

  // 阻止冒泡
  stopEvent(e) {},

  // 显示/隐藏客服弹窗
  changeServiceModal(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({ service: status });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ status: options.pageid });
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