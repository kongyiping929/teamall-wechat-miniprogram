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
    list:'',
    pageNum :1
  },

  init() {
    this.setData({ pageNum:1 })
    const { id, pageNum  } = this.data;
    ajax.post('/app/user/productorder/myorder', { orderStatus: id, pageNum  })
      .then(res => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        let list = res.data.list;
        for(let k in list){
          list[k].price =list[k].payAmount/list[k].buyNum
          if (list[k].userAddressInfo){
            list[k].userAddressInfo = JSON.parse(list[k].userAddressInfo)
          }
        }
        this.setData({ list })
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
    wx.navigateTo({ url: `/pages/orderDetails/orderDetails?pageid=${e.currentTarget.dataset.status}&id=${e.currentTarget.dataset.id}` })
  },

  cancelOrder(e){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消该订单吗？',
      success(res) {
        if (res.confirm) {
          ajax.post('/app/user/productorder/cancel', { orderNo: e.currentTarget.dataset.orderno })
            .then(res => {
              wx.showToast({
                title: '取消成功！',
                icon: 'none',
                duration: 2000,
                success(res) {
                  that.init();
                }
              });
            })
        } 
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id })
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
    this.init();
  },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() 
    this.init();
  },

  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    let that = this;
    this.setData({ pageNum: this.data.pageNum+1 })
    const { id, pageNum } = this.data;
    ajax.post('/app/user/productorder/myorder', { orderStatus: id, pageNum })
      .then(res => {
        let list = res.data.list;
        for (let k in list) {
          if (list[k].userAddressInfo) {
            list[k].userAddressInfo = JSON.parse(list[k].userAddressInfo)
          }
        }
        this.setData({ list: [...this.data.list, ...list] })
      })
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
    const pages = getCurrentPages()
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      refresh: false
    })
    wx.switchTab({ url: '/pages/user/user' });
  },
})