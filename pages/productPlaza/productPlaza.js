// pages/productPlaza/productPlaza.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    myPunchList:"",
    contentState:true
  },

  // 初始化
  init() {
    let that = this;
    const { id } = this.data
    ajax.post('/app/microSquare/findMicroSquareDetail', { id})
      .then(res => {
        this.setData({ list: res.data });
      })
  },
  microSquareList() {
    let that = this;
    const { id } = this.data
    ajax.post('/app/microSquare/findMicroSquarePunchList', { squareId :id})
      .then(res => {
        let myPunchList = res.data.list
        myPunchList.filter((v, i) => {
          v.imgList = v.attachmentInfo ? v.attachmentInfo.split(",").reverse() : [];
          v.orderInfo = v.orderInfo ? v.orderInfo : "";
        })
        this.setData({ myPunchList});
      })
  },
  //点赞
  checkedPunch(e) {
    let id = e.currentTarget.dataset.id
    ajax.post('/app/product/likeUserPunch', { id })
      .then(res => {
        wx.showToast({
          title: '点赞成功！',
          icon: 'none',
          duration: 2000
        });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id }, () => { this.init(); this.microSquareList()})
    
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