// pages/cardRecord/cardRecord.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    contentState:true
  },
  myPunchList() {
    let that = this;
    const { myPunchList } = this.data
    ajax.post('/app/microSquare/findMyPunchList', { })
      .then(res => {
        let myPunchList = res.data.list
        myPunchList.filter((v, i) => {
          v.imgList = v.attachmentInfo ? v.attachmentInfo.split(",").reverse():[]
          v.orderInfo = v.orderInfo ? v.orderInfo:""
        })
        this.setData({ myPunchList  });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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