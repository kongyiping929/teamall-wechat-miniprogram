// pages/confirmMake/confirmMake.js
const dateTimePicker = require('../../assets/js/dateTimePicker');
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: '', // 备注
    couponActive: null,
    dateTime: null, // 选择的日期
    dateTimeYTD: '', // 年月日
    dateTimeArray: null, // 日期列表
    masterWorkerArr: [], // 茶师傅数组
    masterWorker: 0, // 茶师傅
    couponModal: false, // 优惠券模态框 true 显示 false 隐藏
    payChannel: 1,//支付默认微信
    imgList: [
      "/assets/image/confirmMake/selectActive.png",
      "/assets/image/confirmMake/select.png",
    ],
    price: 0,
    refresh: true,
    couponPrice:0,
    refresh: true
  },

  // 初始化时间
  initTime() {
    let obj = dateTimePicker.dateTimePicker();
    let dateTimeYTD = dateTimePicker.getDateTimeYTD(obj.dateTime);
    const { items: { productId, shopId, specId, specLineId, specPackageId, specPayNum} } = this.data;
    ajax.post('/app/product/getAppointmentOrderConfirmInfo', { productId, shopId, specId, specLineId, specPackageId })
      .then(res => {
        if (res.code == "-200113") {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/makeList/makeList' });
          }, 800);
        } 
        this.setData({ list: res.data, masterWorkerArr: res.data.teaArtList, coupon: res.data.userCouponList, price: parseFloat(res.data.unitPrice * specPayNum).toFixed(2) })
      })
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeYTD
    });
    console.log(obj.dateTime, obj.dateTimeArray, dateTimeYTD)
  },

  // 更改茶艺师傅
  bindPickerChange(e) { 
    console.log(e.detail.value)
    this.setData({ masterWorker: e.detail.value }) 
  },

  // 更改备注文字内容
  changeRemark(e) {
    this.setData({ remark: e.detail.value });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ items: JSON.parse(options.item) })
    this.data.refresh ? this.initTime() : "";
  },

  // 更改年月日
  changeDateTime1(e) {
    try {
      dateTimePicker.verify(e.detail.value);
      let dateTimeYTD = dateTimePicker.getDateTimeYTD(e.detail.value);
      this.setData({ dateTime: e.detail.value, dateTimeYTD });
      console.log(e.detail.value, dateTimeYTD)
    } catch (error) {
      wx.showToast({
        title: '预约时间已超时,请选择下一时间段',
        icon: 'none',
        duration: 2000
      });
      this.initTime();
    }
  },

  // 更改时间
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    
    try {
      dateTimePicker.verify(arr);
      let dateTimeYTD = dateTimePicker.getDateTimeYTD(arr);
      this.setData({
        dateTimeArray: dateArr,
        dateTime: arr,
        dateTimeYTD
      });
    } catch (error) {
      wx.showToast({
        title: '预约时间已超时,请选择下一时间段',
        icon: 'none',
        duration: 2000
      });
      this.initTime();
    }
  },
  // 显示隐藏优惠券模态框
  changeCouponModal(e) {
    this.setData({ couponModal: e.currentTarget.dataset.status });
  },
  couponChange(e) {
    let item = e.currentTarget.dataset.item
    const { price}= this.data;
    if (price < item.useQuota) return wx.showToast({
      title: '不满足优惠金额！',
      icon: 'none',
      duration: 2000
    });
    this.setData({ couponActive: item, couponModal: false, couponPrice: parseFloat(price - price * (item.discount || 1) - (item.subtractQuota || 0)).toFixed(2) });
  },
  stopEvent(e) {}, // 防止冒泡

  // 提交预约
  confirmMake(e) {
    let that = this;
    const { dateTimeYTD, masterWorkerArr, masterWorker, consignee, payChannel, list, items: { specPayNum, productId, productTypeId, shopId, specId, specLineId, specPackageId }, dateTime, couponActive, remark } = this.data;
    let data = {
      id: this.data.items.id ? this.data.items.id:"",
      appointmentTime: dateTimeYTD,
      peopleNum : specPayNum,
      initiationChannel: 2,
      payChannel: payChannel + 1,
      productId,
      productTypeId,
      serviceUserId: masterWorkerArr.length>0?masterWorkerArr[masterWorker].userId:"",
      shopId,
      specId, 
      specLineId,
      specPackageId,
      timeRange: list.timeRangeList[dateTime[1]].dictValue,
      couponId: couponActive && (couponActive.couponId || '') || "",
      remark
    }
    ajax.post('/app/user/appointment/saveappointment', data)
      .then(res => {
        if (!payChannel == 0) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function (res) {
            if (res.data) {
              wx.showToast({
                title: '订单支付成功',
                icon: 'none',
                duration: 2000
              });
              
            } 
            setTimeout(() => {
              wx.navigateTo({ url: '/pages/makeList/makeList' });
            }, 800);
          },
          fail: function (res) {
            that.setData({ refresh: false })
            wx.showToast({
              title: '订单支付失败',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              wx.navigateTo({ url: '/pages/makeList/makeList' });
            }, 800);
          }
        })
        } else {
          wx.showToast({
            title: '订单支付成功',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/makeList/makeList' });
          }, 800);
        }
        console.log(Object.keys(res.data))
      })
    //wx.navigateTo({ url: '/pages/makeList/makeList' })
  },

  changPayChannel() {
    this.setData({ payChannel: this.data.payChannel == 0 ? 1 : 0 })
  },

  geTel(tel) {
    var reg = /^(\d{2})\d{7}(\d{2})$/;
    return tel ? tel.replace(reg, "$1*******$2") : "未绑定";
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