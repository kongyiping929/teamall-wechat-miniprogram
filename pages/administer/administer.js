// pages/administer/administer.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    switch1Checked: false, // 预约接单
    shopModal:false,
    shopList:""
  },

  // 更改预约接单
  switch1Change(e) {
    this.setData({ switch1Checked: e.detail.value })
    ajax.post('/app/user/manage/updAppointmentStatus', { appointmentStatus: e.detail.value?1:2 })
      .then(res => {
        wx.showToast({
          title: '已更新',
          icon: 'none',
          duration: 2000
        });
      })
  },

  showModal() {
    this.setData({ shopModal: true })
  },
  hideModal() {
    this.setData({ shopModal: false })
  },

  // 初始化
  init() {
    let that = this;
    ajax.post('/app/user/manage/getdata', { shopId: app.globalData.shopId })
      .then(res => {
        console.log(res)
        this.setData({ list: res.data, shopActiveId: res.data.shopId});
      })
    this.shopList()
  },

  shopList() {
    let that = this;
    ajax.post('/app/user/manage/manageshop', {})
      .then(res => {
        this.setData({ shopList:res.data});
      })
  },

  changesShop(e){
    this.setData({ shopActiveId: e.currentTarget.dataset.shopId });
    ajax.post('/app/index/updCurrentShop', { id: e.currentTarget.dataset.item.shopId })
      .then(res => {
        this.hideModal();
        wx.setStorageSync('SHOP', e.currentTarget.dataset.item)
        app.globalData.shopId = e.currentTarget.dataset.item.shopId;
        app.globalData.shop = e.currentTarget.dataset.item;
        this.init();
      })
    
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
    this.init()
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