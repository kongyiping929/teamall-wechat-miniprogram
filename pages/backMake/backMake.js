// pages/backMake/backMake.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

const orderStatusArr = ['', '待支付', '待确认', '待服务', '已完成', '退款成功', '退款失败', '已取消'];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderStatusArr,
    orderNo: ""
  },

  init() {
    const { id } = this.data;
    ajax.post('/app/user/manage/getappointment', { shopId: app.globalData.shopId })
      .then(res => {
        let list = res.data.list;
        this.setData({ list })
      })
  },
//确认预约/完成服务
  payConfirm(e) {
    console.log(e, e.currentTarget.dataset.orderstatus)
    let that = this;
    let orderStatus = e.currentTarget.dataset.orderstatus;
    let url = orderStatus == 2 ? "/app/user/manage/confirmappoint" : "/app/user/manage/completeappoint"
    wx.showModal({
      title: '提示',
      content: orderStatus == 2 ? '请确认预约体验产品及服务人数!' :'请确认到店客户已完成体验!',
      confirmText: orderStatus == 2 ? "确认预约":"完成服务",
      success(res) {
        if (res.confirm) {
          ajax.post(url, { orderNo: e.currentTarget.dataset.orderno })
            .then(res => {
              wx.showToast({
                title: '确认成功！',
                icon: 'none',
                duration: 2000
              });
              setTimeout(() => {
                that.init()
              }, 800);
            })
        }
      }
    })
    
    
  },
  //退款
  payCancel(e) {
    wx.showModal({
      title: '提示',
      content: '请确认预约订单内容,点击确认后将发起退款!',
      confirmText: "确认退款",
      success(res) {
        ajax.post('/app/user/manage/refundappoint', {
          orderNo: e.currentTarget.dataset.orderno 
        })
          .then(res => {
            wx.showToast({
              title: '退款成功！',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              this.init()
            }, 800);
          })
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