// pages/editorShelf/editorShelf.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:'',
    showType:["新","佳","惠"],
    type:0,
    pageNum: 1
  },

  init() {
    const { type, pageNum } = this.data;
    let url = type == 0 ? "/app/product/findUpperShelfList" :"/app/product/findLowerShelfList"
    ajax.post(url, { pageNum})
      .then(res => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({ product: res.data})
      })
  },

  selectProduct(e){
    console.log(e)
    const { productId, productName, typeName } = e.target.dataset.item
    let item = {
      productId,
      productName,
      typeName,
      type: this.data.type
    }
    wx.navigateTo({
      url: '/pages/editorShelfDetails/editorShelfDetails?item=' + JSON.stringify(item) ,
    })
  },

  changeQueryType(e){
    this.setData({ type: e.target.dataset.value },()=>this.init())
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
    wx.showNavigationBarLoading();
    this.setData({ pageNum: 1 })
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    this.setData({ pageNum: this.data.pageNum + 1 })
    const { type, pageNum} = this.data;
    let url = type == 0 ? "/app/product/findUpperShelfList" : "/app/product/findLowerShelfList"
    ajax.post(url, { pageNum})
      .then(res => {
        let list = res.data;
        this.setData({ product: [...that.data.product, ...list] })
      })
  },
})