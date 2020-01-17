// pages/myCollect/myCollect.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js'); 
const typeArr = [
  {
    title: '最新上架',
    class: '',
    icon: '/assets/image/index/new_icon.png'
  },
  {
    title: '佳节礼品',
    class: 'gift',
    icon: '/assets/image/index/benefit_icon.png'
  },
  {
    title: '优惠不断',
    class: 'discounts',
    icon: '/assets/image/index/benefit_icon.png'
  }
]
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    typeArr,
    list:""
  },

  // 跳转产品详情
  goProductDetails(e) {
    wx.navigateTo({ url: `/pages/productDetails/productDetails?id=${e.currentTarget.dataset.orderid}` });
  },

  // 初始化
  init() {
    let that = this;
    const { keyword } = this.data
    ajax.post('/app/user/collection/list', {})
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({ list: res.data.list });
      })
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