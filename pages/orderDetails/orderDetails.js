// pages/orderDetails/orderDetails.js
const ajax = require('../../assets/js/ajax.js');
const app = getApp()
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

  init() {
    const { id } = this.data;
    ajax.post('/app/user/productorder/orderdetail', { id })
      .then(res => {
        let list = res.data;
        if (list.userAddressInfo) {
          list.userAddressInfo = JSON.parse(list.userAddressInfo)
        }
        this.setData({ list })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ status: options.pageid, id: options.id }, () => this.init());
  },

  submitOrder() {
    const { consignee, couponActive, productTypeId, payChannel, receiveType, buyNum, productId, shopId, specId, specLineId, specPackageId, remark, userAddressInfo  } = this.data.list;
    let data = {
      buyNum,
      initiationChannel: 2,
      payChannel,
      productId,
      productTypeId,
      punchStatus: 1,
      receiveType,
      shopId: app.globalData.shopId,
      specId,
      specLineId,
      specPackageId,
      userAddressInfo: receiveType == 2 ? userAddressInfo : {},
      couponId: couponActive && (couponActive.id || ''),
      remark
    }
    ajax.post('/app/user/productorder/saveorder', data)
      .then(res => {
        console.log(payChannel, payChannel == 0)
        if (!payChannel == 0) {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: function (res) {
              console.log(res, res.data)
              wx.showToast({
                title: '订单支付成功',
                icon: 'none',
                duration: 2000
              });
              setTimeout(() => {
                wx.navigateTo({ url: '/pages/orderList/orderList?id=2' })
              }, 800);
            },
            fail: function (res) {
              wx.showToast({
                title: '订单支付失败',
                icon: 'none',
                duration: 2000
              });
            }
          })
        } else {
          console.log(res)
          wx.showToast({
            title: '订单支付成功',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/orderList/orderList?id=2' })
          }, 800);
        }

      })
  },

  confirmOrder(e){
    let status = e.currentTarget.dataset.status;
    const { id } = this.data.list;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    ajax.post('/app/user/manage/updOrderStatus', { orderId: id, optType: status==3?3:1  })
      .then(res => {
        wx.showToast({
          title: status == 3?'确认收货成功！':'申请成功！',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          prevPage.setData({
            id: status == 3 ?4:5
          })
          wx.navigateBack({
            delta: 1,
          })
        }, 1000);
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
    //wx.navigateTo({ url: '/pages/orderList/orderList?id=1' });
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