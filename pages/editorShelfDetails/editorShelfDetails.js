// pages/editorShelfDetails/editorShelfDetails.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:"",
    showModal:false,
    modalData:""
  },

  init() {
    const { productId  } = this.data;
    ajax.post("/app/product/findLowerShelfInfo", { id: productId })
      .then(res => {
        this.setData({ product: res.data })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,options.productId )
    this.setData({ productId: options.productId },()=>this.init())
  },
  editStock(e){
    const { product: { specInfoVoList} } = this.data;
    console.log(specInfoVoList)
    let data = specInfoVoList.packageList[e.target.dataset.index];
    data.stockNum ? "" : data.stockNum=0;
    console.log(data)
    this.setData({ packageList: data, showModal: true, modalData: data})
  },
//库存修改
  inputChange(e){
    console.log(e.detail)
    this.setData({ showModal:false})
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