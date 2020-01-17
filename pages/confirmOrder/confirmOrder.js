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
    items:"",//规格参数
    receiveType :1,//取货方式
    payChannel :1,//支付默认微信
    imgList: [
      "/assets/image/confirmMake/selectActive.png",
      "/assets/image/confirmMake/select.png",
    ],
    price:0,
    couponPrice:0,
    refresh:true
  },

  // 更改备注
  changeRemark(e) {
    console.log(e, e.detail.value)
    this.setData({ remark: e.detail.value });
  },

  // 显示隐藏优惠券模态框
  changeCouponModal(e) {
    let {status} = e.currentTarget.dataset;
    this.setData({ couponModal: status });
  },
  cancelCouponModal(e) {
    let { status } = e.currentTarget.dataset;
    if (!status) { this.setData({ couponActive: null, couponModal: false }) }
  },
  couponChange(e){
    const { price} = this.data;
    let item = e.currentTarget.dataset.item
    if (price < item.useQuota) return wx.showToast({
      title: '不满足优惠金额！',
      icon: 'none',
      duration: 2000
    });
    this.setData({ couponActive: item, couponModal: false, couponPrice: parseFloat(price - price * (item.discount || 1) - (item.subtractQuota || 0)).toFixed(2) });
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
    this.setData({
      addPersonStatus: status,
    })
  },
  

  stopEvent(e) {}, // 防止冒泡

  init(){
    const { items: { productId, shopId, specId, specLineId, specPackageId, specPayNum}} = this.data;
    ajax.post('/app/product/getOrderConfirmInfo', { productId, shopId, specId, specLineId, specPackageId })
      .then(res => {
        if (res.code == "-200112") {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/orderList/orderList?id=1' });
          }, 800);
        } else{
          let consignee = "";
          res.data && res.data.userAddressList.filter((v, i) => {
            v.defaultStatus == 1 ? consignee = v : "";
          })
          this.setData({ list: res.data, consignee, coupon: res.data.userCouponList, price: parseFloat(res.data.unitPrice * specPayNum).toFixed(2)  })
        }
        
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ items: JSON.parse(options.item) })
  },

  changPayChannel(){
    this.setData({ payChannel: this.data.payChannel==0?1:0})
  },

  changReceiveType(){
    this.setData({ receiveType: this.data.receiveType==0?1:0})
  },

  submitOrder(){
    let that = this;
    const { consignee, couponActive, payChannel, receiveType, items: { specPayNum, productId, productTypeId, shopId, specId, specLineId, specPackageId }, remark} = this.data;
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
      couponId: couponActive && (couponActive.userCouponId || '') || "",
      remark
    }
    console.log(data)
    ajax.post('/app/user/productorder/saveorder', data)
      .then(res => {
        console.log(payChannel, payChannel == 1)
        if (payChannel == 1){
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function (result) {
            console.log(result)
            wx.showToast({
              title: '订单支付成功',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              wx.navigateTo({ url: `/pages/orderDetails/orderDetails?pageid=${receiveType == 0 ? 3 : 2}&id=${res.data.id}` })
              //wx.navigateTo({ url: '/pages/orderList/orderList?id=2' });
            }, 800);
          },
          fail: function (result) {
            that.setData({ refresh:false})
            wx.showToast({
              title: '订单支付失败',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              wx.navigateTo({ url: `/pages/orderDetails/orderDetails?pageid=1&id=${res.data.id}` })
              //wx.navigateTo({ url: '/pages/orderList/orderList?id=1' });
            }, 800);
          }
        })}else{
          console.log(res)
          wx.showToast({
            title: '订单支付成功',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            //wx.navigateTo({ url: '/pages/orderList/orderList?id=2' });
            wx.navigateTo({ url: `/pages/orderDetails/orderDetails?pageid=${receiveType==0?3:2}&id=${res.data.id}` })
          }, 800);
        }
        
      })
  },
  tip(){
    wx.showToast({
      title: '此优惠券不适用于该产品！',
      icon: 'none',
      duration: 2000
    });
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
    this.data.refresh?this.init():"";
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

})