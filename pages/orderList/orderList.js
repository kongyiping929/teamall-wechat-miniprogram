// pages/orderList/orderList.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

const orderStatusList = ['', '待支付', '待发货', '待收货', '已完成', '售后/退款'];
const orderStatusBtn = ['', '待支付', '申请退款', '确认收货', '已完成', ""];
const orderStatusArr = ['', '待支付', '待发货', '待收货', '已完成', '退款申请中', '退款成功', '退款失败'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatusList, // 订单状态栏
    orderStatusArr, // 订单状态
    orderStatusBtn,//订单按钮
    id: '', // 状态id
    list:[],
  },

  init() {
    const { id } = this.data;
    ajax.post('/app/user/productorder/myorder', { orderStatus: id })
      .then(res => {
        let list = res.data.list;
        for(let k in list){
          if (list[k].userAddressInfo){
            console.log(list[k].userAddressInfo,JSON.parse(list[k].userAddressInfo))
            list[k].userAddressInfo = JSON.parse(list[k].userAddressInfo)
          }
        }
        this.setData({ list })
        console.log(res.data.list)
      })
  },

  changeId (e) {
    this.setData({ id: e.currentTarget.dataset.id },()=>this.init());
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

  // 跳转订单详情
  goOrderDetails(e) {
    console.log(e.currentTarget.dataset.status, e.currentTarget.dataset.id)
    wx.navigateTo({ url: `/pages/orderDetails/orderDetails?pageid=${e.currentTarget.dataset.status}&id=${e.currentTarget.dataset.id}` })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id })
    this.init();
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