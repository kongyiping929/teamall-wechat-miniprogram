// pages/backPickup/backPickup.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalDelive:false,
    orderNo: "",
    pageNum: 1
  },

  init() {
    const { pageNum } = this.data;
    ajax.post('/app/user/manage/getsend', { shopId: app.globalData.shopId, pageNum })
      .then(res => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        let list = res.data.list;
        for (let k in list) {
          if (list[k].userAddressInfo) {
            list[k].userAddressInfo = JSON.parse(list[k].userAddressInfo)
          }
        }
        this.setData({ list })
      })
  },

  confirmDeliver(e){
    this.setData({ showModalDelive: true, orderNo: e.currentTarget.dataset.orderno})
  },
  deliverEdit(e){
    const { orderNo } = this.data;
    console.log(e, orderNo)
    ajax.post('/app/user/manage/confirmsend', { orderNo, expressCompany: e.detail.company,
     expressNumber :e.detail.orderNo })
      .then(res => {
        wx.showToast({
          title: '已发货成功',
          icon: 'none',
          duration: 2000
        });
        this.hideModel()
        setTimeout(() => {
          this.init()
        }, 800);
        
      })
  },
  hideModel(){
    this.setData({ showModalDelive: false })
  },
  confirmOrder(e) {
    wx.showModal({
      title: '提示',
      content: '请确认取消订单,若取消订单则会发起退款!',
      success(res) {
        if (res.confirm) {
          ajax.post('/app/user/manage/cancelorder', { orderNo: e.currentTarget.dataset.orderno})
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
    ajax.post('/app/user/manage/getsend', { shopId: app.globalData.shopId, pageNum })
      .then(res => {
        let list = res.data.list;
        this.setData({ list: [...that.data.list, ...list] })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})