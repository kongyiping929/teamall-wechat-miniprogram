// pages/confirmOrder/confirmOrder.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
const dateTimePicker = require('../../assets/js/dateTimePicker');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    remark: "", // 备注
    dateTime: null, // 选择的日期
    dateTimeYTD: '', // 年月日
    dateTimeArray: null, // 日期列表
    addPersonStatus: false, // 添加地址模态框
    passenger: [], // 旅客信息
    travellerPerson: [], // 收件人列表
    consignee: null, // 收件人地址对象
    item: "",//规格参数
    specPayNum: 1, // 购买数量
    receiveType: 1,//取货方式
    payChannel: 1,//支付默认微信
    imgList: [
      "/assets/image/confirmMake/selectActive.png",
      "/assets/image/confirmMake/select.png",
    ],
    disableList:[],
    status:false,//是否可预约
  },

  // 更改备注
  changeRemark(e) {
    this.setData({ remark: e.detail.value });
  },

  // 显示隐藏优惠券模态框
  changeCouponModal(e) {
    this.setData({ couponModal: e.currentTarget.dataset.status });
  },

  couponChange(e) {
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
  stopEvent(e) { }, // 防止冒泡

  init() {
    let obj = dateTimePicker.dateTimePicker();
    let dateTimeYTD = dateTimePicker.getDateTimeYTD(obj.dateTime);
    const { productId, userId } = this.data;
    ajax.post('/app/user/manage/getshopproductinfo', { productId, userId, shopId: app.globalData.shopId  })
      .then(res => {
        this.setData({ list: res.data })
        this.specList()
      })
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeYTD
    });
  },

  // 显示/隐藏产品规格模态框
  changeSpecModal(e) {
    let { status } = e.currentTarget.dataset;
    if (this.data.productSpecsItem) {
      this.setData({ specModal: status });
    } else {
      wx.showToast({
        title: '该产品暂不提供预约体验服务',
        icon: 'none',
        duration: 2000
      });
    }
  },
  //产品规格列表
  specList() {
    const { list } = this.data;
    ajax.post('/app/product/findSpecInfo', { id: list.productId })
      .then(res => {
        let data = null;
        let list = res.data.list;
        let status = false;
        let productSubdivisionSpecsItem = null;
        for (let i = 0; i < list.length; i++) {
          if (list[i].appointmentStatus == 1 && !status) { 
            status = true; data = list[i] ;
            productSubdivisionSpecsItem = list[i].lineList.length > 0 ? list[i].lineList[0] : null;
          }
        }
        this.setData({
          specList: res.data.list,
          productSpecs: res.data.list,
          productSubdivisionSpecs: data.lineList,
          productSpecsItem: data,
          productSubdivisionSpecsItem,
        });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ productId: options.productId, userId: options.userId });
    this.init();
  },
  // 加减产品购买数量 type 0 减 1 加
  changeSpecPayNum(e) {
    let {
      type
    } = e.currentTarget.dataset;
    let {
      specPayNum
    } = this.data;
    if (type === 0) {
      if (specPayNum - 1 === 0) return;
      this.setData({
        specPayNum: --specPayNum
      });
    } else {
      this.setData({
        specPayNum: ++specPayNum
      });
    }
  },
  changPayChannel(e) {
    console.log(e)
    this.setData({ payChannel: e.currentTarget.dataset.type })
  },

  changReceiveType() {
    this.setData({ receiveType: this.data.receiveType == 0 ? 1 : 0 })
  },

  submitOrder() {
    if (!this.data.productSpecsItem) {
      wx.showToast({
        title: '该产品暂不提供预约体验服务',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    const { dateTimeYTD, dateTime, payChannel, remark, productSpecsItem, productPackSpecsItem, productSubdivisionSpecsItem, userId, productId, list,specPayNum } = this.data;
    let data = {
      payChannel: payChannel + 1 == 2?2:1,
      productId,
      productTypeId: list.productTypeId,
      shopId: app.globalData.shopId,
      specId: productSpecsItem.specId,
      specLineId: productSubdivisionSpecsItem.id,
      userId,
      buyNum: specPayNum,
      remark,
      appointmentTime: dateTimeYTD,
      timeRange: list.timeRangeList[dateTime[1]].dictValue,
      freeSheet:payChannel==2?1:2
    }
    ajax.post('/app/user/manage/sendAppointOrder', data)
      .then(res => {
        wx.showToast({
          title: '订单确认成功',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 2,
          })
        }, 800);

      })
  },

  // 选择器
  select(e) {
    let { index, field } = e.currentTarget.dataset;
    let unitPrice = 0;
    let {
      productPackSpecs,
      productSpecs,
      productSubdivisionSpecs,
      productPackSpecsItem,
      productSpecsItem,
      productSubdivisionSpecsItem,
      urltype
    } = this.data;
    this.setData({ specPayNum: 1 })
    if (field === 'productSpecs') {
      let list = productSpecs[index];
      let productSubdivisionSpecsItem = list.lineList.length > 0 ? list.lineList[0] : null;
      let productPackSpecsItem = null;
      unitPrice = (parseFloat(productSpecs[index].basePrice)*100 + (productPackSpecsItem ? parseFloat(productPackSpecsItem.addPrice)*100 : 0) + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice)*100 : 0))/100;

      this.setData({
        productSpecsItem: list,
        unitPrice: unitPrice,
        productSubdivisionSpecs: list.lineList,
        productSubdivisionSpecsItem,
        productPackSpecsItem,
        productPackSpecs: list.packageList,
      });
    }
    if (field === 'productSubdivisionSpecs') {
      unitPrice = parseFloat(productSubdivisionSpecs[index].addPrice) + (productPackSpecsItem ? parseFloat(productPackSpecsItem.addPrice) : 0) + (productSpecsItem ? parseFloat(productSpecsItem.basePrice) : 0);
      this.setData({
        productSubdivisionSpecsItem: productSubdivisionSpecs.length > 0 ? productSubdivisionSpecs[index] : [],
        unitPrice: parseFloat(unitPrice).toFixed(2),
      });
    }
    if (field === 'productPackSpecs') {
      unitPrice = parseFloat(productPackSpecs[index].addPrice) + (productSpecsItem ? parseFloat(productSpecsItem.basePrice) : 0) + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice) : 0);
      this.setData({
        productPackSpecsItem: productPackSpecs[index],
        unitPrice: parseFloat(unitPrice).toFixed(2),
      });
    }
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