// pages/makeList/makeList.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
const orderStatusArr = ['', '去支付', '待确认', '待服务', '已完成', '退款成功', '退款失败', '已取消'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatusArr,
    pageNum: 1
  },

  // 初始化
  init() {
    let that = this;
    const { keyword, pageNum } = this.data
    ajax.post('/app/user/appointment/myappointment', { pageNum })
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({ list: res.data.list });
      })
  },
  goConfirmMake(e) {
    let list = e.currentTarget.dataset.item;
    let product = {
      productId: list.productId,
      productTypeId: list.productTypeId,
      shopId: app.globalData.shopId,
      specId: list.specId,
      specLineId: list.lineSpecId,
      specId: list.specId,
      specPackageId: list.packageSpecId,
      specPayNum: list.peopleNum,
      shopName: list.shopName,
    }
    wx.navigateTo({
      url: '/pages/confirmMake/confirmMake?item=' + JSON.stringify(product)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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
    wx.switchTab({ url: '/pages/find/find' })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ pageNum: 1 })
    this.init()
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