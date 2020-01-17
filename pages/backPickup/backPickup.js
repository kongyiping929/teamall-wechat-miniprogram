// pages/backPickup/backPickup.js
const ajax = require('../../assets/js/ajax.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1
  },
  init() {
    const { pageNum } = this.data;
    ajax.post('/app/user/manage/getpickup', { shopId: app.globalData.shopId, pageNum  })
      .then(res => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({ list:res.data.list })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  confirmDeliver(e) {
    this.setData({ showModalDelive: true, orderNo: e.currentTarget.dataset.orderno })
  },
  confirmOrder(e){
    wx.showModal({
      title: '提示',
      content: '请确认取消订单,若取消订单则会发起退款!',
      success(res) {
        if (res.confirm) {
          ajax.post('/app/user/manage/cancelorder', { orderNo: e.currentTarget.dataset.orderno })
            .then(res => {
              wx.showToast({
                title: '已取消订单',
                icon: 'none',
                duration: 2000
              });
              this.init();
            })
        } 
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
    wx.showNavigationBarLoading();
    this.setData({ pageNum: 1 })
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    this.setData({ pageNum: this.data.pageNum + 1 })
    const { pageNum } = this.data;
    ajax.post('/app/user/manage/getpickup', { shopId: app.globalData.shopId, pageNum })
      .then(res => {
        let list = res.data.list;
        this.setData({ list: [...that.data.list, ...list] })
      })
  },

})