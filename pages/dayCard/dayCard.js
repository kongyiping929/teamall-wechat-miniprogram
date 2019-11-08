// pages/dayCard/dayCard.js
const ajax = require('../../assets/js/ajax.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productTypeArr: ['加载中'], // 产品类型数组
    productTypeIndex: 0, // 产品类型选中下标
    squareId:0,
    remark: '', // 编辑文字
    userImage: [], // 用户选择的图片
    modal: false, // 打卡模态框
  },

  // 筛选器
  bindPickerChange: function (e) {
    console.log(e)
    this.setData({
      productTypeIndex: e.detail.value,
      productId: e.target.dataset.id
    })
  },

  // 选择图片
  selectImage(e) {
    let that = this;
    let { userImage } = that.data;
    if (userImage.length > 2) return;
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        userImage.unshift(tempFilePaths)
        that.setData({ userImage });
      },
      fail(err) {
        console.log(err)
      } 
    })
  },

  // 更改编辑文字
  changeRemark(e) {
    this.setData({ remark: e.detail.value })
  },

  // 更改模态框
  changeModal(e) {
    let { status, confirm } = e.currentTarget.dataset;
    let { remark, squareId } = this.data;
    let that = this;
    ajax.post('/app/user/punch/save', { content : remark,squareId })
      .then(res => {
        
      })
    
    // this.setData({ modal: status }, () => {
    //   if (confirm) {
    //     // wx.switchTab({ url: '/pages/index/index' });
    //     wx.navigateBack({ delta: 1 });
    //   }
    // });
  },

  // 初始化
  init() {
    let that = this;
    
    ajax.post('/app/user/punch/preInfo',{})
      .then(res => {
        console.log(res.data.list)
        that.setData({
          shop: res.data.list,
        })
      })
    ajax.post('/app/microSquare/findMicroSquareList', { "pageSize": 9999})
      .then(res => {
        console.log(res.data.list)
        that.setData({ 
          productTypeArr:res.data.list,
          squareId: res.data.list[0].squareId
        })
      })
  },

  shopList(){
    let that = this;
    ajax.post('/app/user/punch/preInfo')
      .then(res => {
        
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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