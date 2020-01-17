// pages/cardRecord/cardRecord.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    contentState:true,
    userPunchIndex: -1,
    userPunchListImg: [
      "/assets/image/find/goodIconSelect.png",
      "/assets/image/find/goodIcon.png",
    ],
  },
  myPunchList() {
    let that = this;
    const { myPunchList, options } = this.data
    let url = options.productId ? '/app/product/findUserPunchList' : '/app/microSquare/findMyPunchList'
    ajax.post(url, {productId:options.productId? options.productId:'' })
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
    console.log(options)
    this.setData({options:options})
    this.myPunchList()
  },

  checkedPunch(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let { myPunchList } = this.data;
    ajax.post('/app/product/likeUserPunch', { id })
      .then(res => {
        myPunchList[index].likeNum += 1;
        this.setData({ myPunchList, userPunchIndex: index })
        wx.showToast({
          title: '点赞成功！',
          icon: 'none',
          duration: 2000
        });
      })
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