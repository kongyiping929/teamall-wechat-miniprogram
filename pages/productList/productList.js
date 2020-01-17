// pages/productList/productList.js
const ajax = require('../../assets/js/ajax.js');
const app = getApp()
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
    typeId: "", // 类型
    searchType:1,//销量-价格
    productTypeId:"",
    pageNum :1
  },
  // 初始化
  init() {
    let { typeId, searchType, productTypeId, pageNum } = this.data;
    let data = {
      "searchType": searchType,
      "shopId": app.globalData.shopId,
      pageNum
    }
    console.log(typeId, typeId != "")
    if (typeId!=""){
      data.showType = Number(typeId) + 1;
    }else{
      data.productTypeId = productTypeId
    }
    let that = this;
    let url = typeId == "" ? '/app/index/findProductList': '/app/index/findProductList'
    ajax.post(url,data)
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({list: res.data.list})
      })
  },

  changSearchType() {
    this.setData({ searchType: this.data.searchType == 1 ? 2 : 1 }, () => this.init() )
  },

  // 下拉刷新
  onRefresh() {
    console.log("zzzzz")
    
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
    let typeId = options.type?options.type:"";
    let productTypeId = options.productTypeId ? options.productTypeId:"";
    console.log(options)
    wx.setNavigationBarTitle({ title: typeId!=""?typeArr[typeId].title:"产品分类" });
    this.setData({ typeId, productTypeId });
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
    this.setData({ pageNum: 1 })
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