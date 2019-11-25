// pages/backPickup/backPickup.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalRefund: false,
    orderNo: ""
  },

  init() {
    const { id } = this.data;
    ajax.post('/app/user/manage/getrefunding', { shopId: app.globalData.shopId })
      .then(res => {
        let list = res.data.list;
        for (let k in list) {
          if (list[k].userAddressInfo) {
            list[k].userAddressInfo = JSON.parse(list[k].userAddressInfo)
          }
        }
        this.setData({ list })
      })
  },
  refundEdit(e) {
    const { orderNo } = this.data;
    console.log(e, orderNo)
    ajax.post('/app/user/manage/updOrderStatus', {
      orderNo, optType: 2
    })
      .then(res => {
        wx.showToast({
          title: '退款成功',
          icon: 'none',
          duration: 2000
        });
        this.hideModel()
        setTimeout(() => {
          this.init()
        }, 800);
      })
  },
  confirmRefund(e) {
    this.setData({ showModalRefund: true, orderNo: e.currentTarget.dataset.orderno })
  },
  hideModel() {
    this.setData({ showModalRefund: false })
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