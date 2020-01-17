// pages/myRedPacket/myRedPacket.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
const orderStatusArr = [
  {
    class: '',
    text: '申请中' 
  },
  {
    class: 'succ',
    text: '申请成功' 
  },
  {
    class: 'err',
    text: '申请失败' 
  }
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatusArr, // 订单状态
    list:"",
    withdrawBalance:0
  },

  // 初始化
  init() {
    let { } = this.data;
    let that = this;
    ajax.post('/app/redPackage/findList', {})
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({ list:res.data.list})
      })
  },

  save() {
    let that = this;
    ajax.post('/app/redPackage/save', {})
      .then(res => {
        wx.showModal({
          title: '提示',
          content: '红包领取额度:¥' + res.data.withdrawBalance + ',提现手续费:¥' + res.data.withdrawFee + ',手续费比例:' + res.data.withdrawFeeRadio*100  + '%,申请发出,请耐心等待.',
          confirmText:  "确认",
          showCancel:false
        })
        that.init();
        that.setData({ withdrawBalance: 0 })
      })
  },

  // 下拉刷新
  onRefresh(index = 'false') {
    // let { pageId, size, id } = this.data;
    // pageId = 1;
    // ajax.downPost(URLARR[Number(id)], { pageId, size })
    //   .then(({ returnData }) => {
    //     this.setData({
    //       data: returnData.result,
    //       pageId: pageId + 1,
    //       status: returnData.result.length < size ? true : false,
    //     })
    //   })
  },

  // 上滑刷新
  onEndReached() {

    // let { pageId, size, status, id } = this.data;
    // if (status) return wx.showToast({
    //   title: '已无历史数据',
    //   icon: 'none',
    //   duration: 2000
    // });

    // ajax.post(URLARR[Number(id)], { pageId, size })
    //   .then(({ returnData }) => {
    //     this.setData({
    //       data: [...this.data.data, ...returnData.result],
    //       pageId: pageId + 1,
    //       status: returnData.result.length < size ? true : false,
    //     });
    //   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
    this.setData({ withdrawBalance: options.withdrawBalance})
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
    this.init()
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