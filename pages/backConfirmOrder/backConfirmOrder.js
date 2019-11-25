// pages/confirmOrder/confirmOrder.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    remark: "", // 备注
    coupon: null,//优惠券
    couponActive:null,
    couponModal: false, // 优惠券模态框 true 显示 false 隐藏
    addPersonStatus: false, // 添加地址模态框
    passenger: [], // 旅客信息
    travellerPerson: [], // 收件人列表
    consignee: null, // 收件人地址对象
    item:"",//规格参数
    receiveType :1,//取货方式
    payChannel :1,//支付默认微信
    imgList: [
      "/assets/image/confirmMake/selectActive.png",
      "/assets/image/confirmMake/select.png",
    ]
  },

  // 更改备注
  changeRemark(e) {
    this.setData({ remark: e.detail.value });
  },

  // 显示隐藏优惠券模态框
  changeCouponModal(e) {
    this.setData({ couponModal: e.currentTarget.dataset.status });
  },

  couponChange(e){
    this.setData({ couponActive: e.currentTarget.dataset.item, couponModal: false });
  },

  // 跳转添加地址
  goAddAddress(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/addAddress/addAddress?item=${item ? JSON.stringify(item) : ''}`
    })
  },

  // 更改收货人
  changeRecipients(e) {
    let { item } = e.currentTarget.dataset;
    //let { freightArr } = this.data;
    //let freightPrice = freightArr.filter(item => item.areaName === contactAddress)[0];
    this.setData({ consignee: item, addPersonStatus: false })
  },

  // 显示/隐藏地址模态框
  changeAddPersonStatus(e) {
    let status = e.currentTarget.dataset.status;
    if (status) {
      // ajax.post('/app/address/getlist')
      //   .then(res => {
          this.setData({
            addPersonStatus: status,
            // travellerPerson: res.returnData
          })
      //   })
    } else {
      this.setData({
        addPersonStatus: status
      })
    }
  },

  stopEvent(e) {}, // 防止冒泡

  init(){
    const { productId, userId } = this.data;
    ajax.post('/app/user/manage/getshopproductinfo', { productId, userId, shopId: "1197444188149604353" })
      .then(res => {
        this.setData({ list: res.data})
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ productId: options.productId, userId: options.userId });
    this.init();
  },

  changPayChannel(){
    this.setData({ payChannel: this.data.payChannel==0?1:0})
  },

  changReceiveType(){
    this.setData({ receiveType: this.data.receiveType==0?1:0})
  },

  submitOrder(){
    const { consignee, couponActive, payChannel, receiveType, item: { specPayNum, productId, productTypeId, shopId, specId, specLineId, specPackageId, remark } } = this.data;
    let data = {
      buyNum: specPayNum,
      initiationChannel :2,
      payChannel: payChannel+1,
      productId,
      productTypeId,
      punchStatus: 1,
      receiveType: receiveType+1,
      shopId ,
      specId ,
      specLineId ,
      specPackageId ,
      userAddressInfo: receiveType == 1 ? consignee : {},
      couponId: couponActive && (couponActive.id || ''),
      remark
    }
    ajax.post('/app/user/productorder/saveorder', data)
      .then(res => {
        console.log(payChannel, payChannel == 0)
        if (!payChannel == 0){
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function (res) {
            console.log(res,res.data)
            wx.showToast({
              title: '订单支付成功',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              wx.navigateTo({ url: '/pages/myReserve/myReserve?id=1'  })
            }, 800);
          },
          fail: function (res) {
            wx.showToast({
              title: '订单支付失败',
              icon: 'none',
              duration: 2000
            });
          }
        })}else{
          console.log(res)
          wx.showToast({
            title: '订单支付成功',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/myReserve/myReserve?id=1' })
          }, 800);
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