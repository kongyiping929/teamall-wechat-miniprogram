// pages/editorShelfDetails/editorShelfDetails.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    product:"",//产品集合
    productType:0,//上架=0，未上架=1
    showModal:false,//弹框显示
    type:false,//上架弹框
    showStock:true,//库存弹框，预约弹框
    modalData:"",//当前选中规格传弹框
    index:[0,0]
  },

  init() {
    const { options, productId, productType  } = this.data;
    let url = productType==0?"/app/product/findSpecInfo":"/app/product/findLowerShelfInfo"
    ajax.post(url, { id: productId })
      .then(res => {
        let data = res.data;
        if (productType == 0){
          data = { productName: options.productName, typeName: options.typeName, specInfoVoList:res.data.list }
        }
        console.log(data)
        this.setData({ product: data })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ productId: options.productId, productType: options.type, options },()=>this.init())
  },
  //库存弹出框
  editStock(e){
    const { product: { specInfoVoList} } = this.data;
    console.log(e)
    let data = specInfoVoList[e.target.dataset.productindex].packageList[e.target.dataset.index];
    this.setData({index:[e.target.dataset.productindex,e.target.dataset.index]})
    data.stockNum ? "" : data.stockNum=0;
    console.log(data)
    this.setData({ packageList: data, showModal: true, modalData: data, type:false, showStock: true,})
  },
  //库存修改
  inputChange(e){
    const {productId,product, product: { specInfoVoList},index } = this.data;
    let specId  = specInfoVoList[index[0]].productSpecId;
    let specPackageId = specInfoVoList[index[0]].packageList[index[1]].id
    let data = specInfoVoList[index[0]].packageList[index[1]];
    data.stockNum=e.detail;
    let products = product;
    products.specInfoVoList[index[0]].packageList[index[1]] = data;
    let updSpecPackageList = this.data.updSpecPackageList;
    this.setData({ product: products });
    console.log(e.detail)
    this.setData({ showModal:false})
    ajax.post("/app/product/updStock", { productId, specId, specPackageId, stockNum: e.detail})
      .then(res => {
      })
  },
  //预约弹出框
  appointmentEdit(e){
    this.setData({ showModal: true, type: false, showStock: false, index: [e.target.dataset.productindex,0] })
  },
  //预约编辑
  appointment(e){
    const {productId, product, product: { specInfoVoList},index } = this.data;
    let data = specInfoVoList[index[0]];
    let appointmentStatus = e.detail.checked ? 1 : 2;
    let appointmentPrice = e.detail.value;
    let specId = data.productSpecId;
    data.appointmentStatus = appointmentStatus;
    data.appointmentPrice = appointmentPrice;
    let products = product;
    products.specInfoVoList[index[0]] = data;
    let updSpecList = this.data.updSpecList;
    this.setData({ product: products, showModal: false, updSpecList })
    ajax.post("/app/product/updAppointment", { productId, specId, appointmentStatus, appointmentPrice })
      .then(res => {
      })
  },
  confirm(){
    this.setData({ showModal: true,type:true, showStock: false})
  },
  productEdit(e){
    console.log(e.detail.checked)
    const { productId} = this.data;
    let data = {
      showType: e.detail.showType,
      showStatus: e.detail.checked?1:2,
      productId,
    }
    ajax.post("/app/product/updUpperShelf", data)
      .then(res => {
        wx.showToast({
          title: "上架成功！",
          icon: 'none',
          duration: 2000,
          success(res) {
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
        });
    })
  },
  downProduct(){
    const { productId } = this.data;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认下架后,该商品将不显示于商城中!',
      success(res) {
        if (res.confirm) {
          ajax.post("/app/product/updLowerShelf", { id: productId})
            .then(res => {
              wx.showToast({
                title: '下架成功',
                icon: 'success',
                duration: 2000,
                success(res) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  hideModel(){
    this.setData({ showModal: false})
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
