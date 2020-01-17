// pages/queryOrder/queryOrder.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
const orderStatusArr = ['','待支付', '待确认', '待服务', '已完成', '退款成功', '退款失败', '已取消'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatusArr,
    queryType: 0, // 查询类型 0 查预约 1 查订单
    keyword: '', // 搜索值
  },
  search() {
    const { keyword, queryType } = this.data;
    let url = queryType == 0 ? "/app/user/manage/getappiontments" : '/app/user/manage/getorders'
    ajax.post(url, { shopId: app.globalData.shopId ,keyword })
      .then(res => {
        let list = res.data;
        for (let k in list) {
          if (list[k].userAddressInfo) {
            list[k].userAddressInfo = JSON.parse(list[k].userAddressInfo)
          }
        }
        this.setData({ list })
      })
  },
  orderInput(e) {
    this.setData({ keyword: e.detail.value })
  },
  // 更改查询类型
  changeQueryType(e) {
    this.setData({ queryType: e.currentTarget.dataset.value, list: "", keyword: '' })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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