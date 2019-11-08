// pages/productList/productList.js
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
    typeId: 0, // 类型
  },
  // 初始化
  init() {
    
    let { typeId } = this.data;
    let data = {
      "pageNum": 1,
      "productTypeId": 0,
      "searchType": 0,
      "shopId": 0,
      "showType": typeId+1,
      "sort": 0
    }
    let that = this;
    ajax.post('/app/index/findProductInfo',{...data})
      .then(res => {
        console.log(res)
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
    let typeId = Number(options.type);
    wx.setNavigationBarTitle({ title: typeArr[typeId].title });
    this.setData({ typeId });
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