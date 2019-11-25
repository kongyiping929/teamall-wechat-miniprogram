// pages/find/find.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentState: true // 文字溢出显示状态 true 显示 false 隐藏
  },

  // 更改文字溢出显示状态
  changeContentState(e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({ contentState: true });
  },

  // 去支付-跳转确认预约页面
  goConfirmMake(e) {
    wx.navigateTo({ url: '/pages/confirmMake/confirmMake?id=' + e.currentTarget.dataset.id })
  },

  // 跳转产品微广场
  goProductPlaza(e) {
    wx.navigateTo({ url: '/pages/productPlaza/productPlaza?id=' + e.currentTarget.dataset.id })
  },
  // 初始化
  microSquareList() {
    let that = this;
    const { keyword } = this.data
    ajax.post('/app/microSquare/findMicroSquareList', { pageSize:8})
      .then(res => {
        this.setData({ list: res.data.list });
      })
  },
  myPunchList() {
    let that = this;
    const { myPunchList } = this.data
    ajax.post('/app/microSquare/findMyPunchList', { pageSize:1})
      .then(res => {
        this.setData({ myPunchList: res.data.list });
        return res.data.list
      }).then((res)=>{
        console.log(res)
        ajax.post('/common/attachment/list', { category: 5, resourceId: res[0].userPunchId })
          .then(res => {
            this.setData({ img: res.data });
          })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.microSquareList()
    this.myPunchList()
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