// pages/user/user.js
const ajax = require('../../assets/js/ajax.js');

const orderList = [
  {
    text: '待支付',
    src: '/assets/image/user/orderIcon0.png'
  },
  {
    text: '待发货',
    src: '/assets/image/user/orderIcon1.png'
  },
  {
    text: '待收货',
    src: '/assets/image/user/orderIcon2.png'
  },
  {
    text: '已完成',
    src: '/assets/image/user/orderIcon3.png'
  },
  {
    text: '售后/退款',
    src: '/assets/image/user/orderIcon4.png'
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList,
    user:'',
    phone:''
  },

  // 跳转我的订单
  goOrderList() {
    wx.navigateTo({ url: '/pages/orderList/orderList?id=1' });
  },
  // 跳转管理操作
  goAdminister() {
    wx.navigateTo({ url: '/pages/administer/administer' });
  },

  // 跳转我的预存
  goMyPrestore(e) {
    wx.navigateTo({ url: '/pages/myPrestore/myPrestore' });
  },

  // 跳转提现(我的红包)
  goMyRedPacket() {
    wx.navigateTo({ url: '/pages/myRedPacket/myRedPacket' });
  },

  // 跳转我的收藏
  goMyCollect() {
    wx.navigateTo({ url: '/pages/myCollect/myCollect' });
  },

  // 跳转我的优惠券
  goMyCoupon() {
    wx.navigateTo({ url: '/pages/myCoupon/myCoupon' });
  },

  // 跳转我的地址
  goAddress() {
    wx.navigateTo({ url: '/pages/addressList/addressList' });
  },
  // 跳转订单详情
  goOrderDetails(e) {
    wx.navigateTo({ url: `/pages/orderDetails/orderDetails?pageid=1&id=${e.currentTarget.dataset.id}` })
  },

  // 初始化
  init() {
    let that = this;
    ajax.post('/app/user/center/userdata')
      .then(res => {
        console.log(res)
        that.setData({ user: res.data, phone: that.geTel(res.data.mobile) });
        console.log(that.geTel(res.data.mobile))
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  goPay(){
    const {user:{}} = this.data;
    let product = {
      productId: id,
      shopId: productSpecsItem.shopId,
      specId: productSpecsItem.specId,
      specLineId: productSubdivisionSpecsItem.id,
      specPackageId: productPackSpecsItem.id,
    }
    console.log(product)
    wx.navigateTo({
      url: urltype === 1 ? '/pages/confirmMake/confirmMake' :
        '/pages/confirmOrder/confirmOrder?item=' + JSON.stringify(product)
    });
  },

  /**
   * 手机号过滤
   */
  geTel(tel) {
    var reg = /^(\d{2})\d{7}(\d{2})$/;
    return tel.replace(reg, "$1*******$2");
  },
  clipboard(){
    wx.setClipboardData({
      data: this.data.user.inviteCode
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