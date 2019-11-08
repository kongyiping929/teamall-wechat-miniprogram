// pages/confirmMake/confirmMake.js
const dateTimePicker = require('../../assets/js/dateTimePicker');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: '', // 备注
    dateTime: null, // 选择的日期
    dateTimeYTD: '', // 年月日
    dateTimeArray: null, // 日期列表
    masterWorkerArr: ['预约茶艺师1', '预约茶艺师2', '预约茶艺师3', '预约茶艺师4', '预约茶艺师5'], // 茶师傅数组
    masterWorker: 0, // 茶师傅
    couponModal: false, // 优惠券模态框 true 显示 false 隐藏
  },

  // 初始化时间
  initTime() {
    let obj = dateTimePicker.dateTimePicker();
    let dateTimeYTD = dateTimePicker.getDateTimeYTD(obj.dateTime);

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeYTD
    });
  },

  // 更改茶艺师傅
  bindPickerChange(e) { 
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
    this.initTime();
  },

  // 更改年月日
  changeDateTime1(e) {
    try {
      dateTimePicker.verify(e.detail.value);
      let dateTimeYTD = dateTimePicker.getDateTimeYTD(e.detail.value);
      this.setData({ dateTime: e.detail.value, dateTimeYTD });
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

  stopEvent(e) {}, // 防止冒泡

  // 提交预约
  confirmMake(e) {
    wx.navigateTo({ url: '/pages/makeList/makeList' })
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