// pages/productDetails/productDetails.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:"",//产品详情
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    current: 0, // 当前滑块的位置
    id: '', // 产品id
    specModal: false, // 产品规格
    specPayNum: 1, // 购买数量
    detailsModal: false, // 产品参数
    productPackSpecsItem: null, // 选中的包装规格 
    productPackSpecs: '', //产品包装规格json串[{ name, unitPrice, buybackUnitPrice }]
    productSpecsItem: null, // 选中的规格
    productSpecs: '', //产品规格json串[{ name, unitPrice, buybackUnitPrice }]
    productSubdivisionSpecsItem: null, // 选中的细分规格
    productSubdivisionSpecs: '', //产品细分规格json串[{ name, unitPrice, buybackUnitPrice }]
    urltype: 1, // 购买跳转的url 1 预约确认 2 订单确认
    service: false, // 客服模态框,
    collection: false,
    price:0,//总价格 
    imgList: [
      "/assets/image/productDetails/starSelect.png",
      "/assets/image/productDetails/star.png",
    ]
  },

  // 初始化
  init() {
    let returnData = {
      productPackSpecs: [],
      productSpecs: [],
      productSubdivisionSpecs: null
    }
    let { productPackSpecs, productSpecs, productSubdivisionSpecs } = returnData;
    const {id} = this.data;
    ajax.post('/app/product/findInfo', { id })
      .then(res => {
        this.setData({ list: res.data, collection: res.data.isCollection });
        console.log(this.data.collection)
      })
    this.setData({ productPackSpecs, productSpecs, productSubdivisionSpecs })

  },

  // 选择器
  select(e) {
    let { index, field } = e.currentTarget.dataset;
    let unitPrice = 0;
    let {
      productPackSpecs,
      productSpecs,
      productSubdivisionSpecs,
      productPackSpecsItem,
      productSpecsItem,
      productSubdivisionSpecsItem
    } = this.data;
    if (field === 'productSpecs') {
      unitPrice = parseFloat(productSpecs[index].unitPrice) + (productPackSpecsItem && productPackSpecsItem !== null ? parseFloat(productPackSpecsItem.unitPrice) : 0) + (productSubdivisionSpecsItem && productSubdivisionSpecsItem !== null ? parseFloat(productSubdivisionSpecsItem.unitPrice) : 0);
      this.setData({
        productSpecsItem: productSpecs[index],
        unitPrice
      });
    }
    if (field === 'productSubdivisionSpecs') {
      unitPrice = parseFloat(productSubdivisionSpecs[index].unitPrice) + (productPackSpecsItem && productPackSpecsItem !== null ? parseFloat(productPackSpecsItem.unitPrice) : 0) + (productSpecsItem && productSpecsItem !== null ? parseFloat(productSpecsItem.unitPrice) : 0);
      this.setData({
        productSubdivisionSpecsItem: productSubdivisionSpecs[index],
        unitPrice
      });
    }
    if (field === 'productPackSpecs') {
      unitPrice = parseFloat(productPackSpecs[index].unitPrice) + (productSpecsItem && productSpecsItem !== null ? parseFloat(productSpecsItem.unitPrice) : 0) + (productSubdivisionSpecsItem && productSubdivisionSpecsItem !== null ? parseFloat(productSubdivisionSpecsItem.unitPrice) : 0);
      this.setData({
        productPackSpecsItem: productPackSpecs[index],
        unitPrice
      });
    }

  },

  // 获取滑块当前索引
  getCurrent(e) {
    this.setData({ current: e.detail.current });
  },

  // 显示/隐藏产品规格模态框
  changeSpecModal(e) {
    let { status, urltype } = e.currentTarget.dataset;
    this.setData({ specModal: status, urltype });
    this.specList();
    
  },

  //产品规格列表
  specList (){
    const { id } = this.data;
    ajax.post('/app/product/findSpecInfo', { id })
      .then(res => {
        console.log(res.data.list[0].packageList[0])
        let data = res.data.list[0];
        let price = parseFloat(data.basePrice) + parseFloat(data.packageList[0].addPrice) +
          parseFloat(data.lineList[0].addPrice) 
        this.setData({ 
          specList: res.data.list, 
          productSpecs: res.data.list,
          productSubdivisionSpecs: res.data.list[0].lineList,
          productPackSpecs: res.data.list[0].packageList ,
          productSpecsItem: res.data.list[0],
          productPackSpecsItem: res.data.list[0].packageList[0],
          productSubdivisionSpecsItem: res.data.list[0].lineList[0],
          price
        });
      })
  },

  // 加减产品购买数量 type 0 减 1 加
  changeSpecPayNum(e) {
    let {
      type
    } = e.currentTarget.dataset;
    let {
      specPayNum
    } = this.data;
    if (type === 0) {
      if (specPayNum - 1 === 0) return;
      this.setData({
        specPayNum: --specPayNum
      });
    } else {
      this.setData({
        specPayNum: ++specPayNum
      });
    }
  },

  // 显示/隐藏路线详情模态框
  changeDetailsModal(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      detailsModal: status
    });
  },

  // 阻止冒泡
  stopEvent(e) {

  },

  // 确认订单
  goConfirmOrder(e) {
    let {
      specPayNum,
      productPackSpecsItem,
      productSpecsItem,
      productSubdivisionSpecsItem,
      list,
      pics,
      urltype,
      id,
    } = this.data;
    if (productSpecsItem === null) return wx.showToast({
      title: '请选择产品规格',
      icon: 'none',
      duration: 2000
    });
    if (productSubdivisionSpecsItem === null) return wx.showToast({
      title: '请选择产品细分规格',
      icon: 'none',
      duration: 2000
    });
    if (productPackSpecsItem === null) return wx.showToast({
      title: '请选择产品包装规格',
      icon: 'none',
      duration: 2000
    });
    let product = {
      productId :id,
      productTypeId: list.productTypeId,
      shopId: productSpecsItem.shopId,
      specId: productSpecsItem.specId,
      specLineId: productSubdivisionSpecsItem.id,
      specPackageId: productPackSpecsItem.id,
      specPayNum,
      shopName: list.shopName,
    }
    console.log(product)
    wx.navigateTo({
      url: urltype === 1 ? '/pages/confirmMake/confirmMake?item=' + JSON.stringify(product)  :
      '/pages/confirmOrder/confirmOrder?item=' + JSON.stringify(product)  });
  },

  changeCollection(){
    const { id, collection } = this.data;
    let data = this.data.collection ? false : true
    this.setData({ collection: data })
    let url = data ? "/app/product/addCollection" :"/app/product/cancelCollection"
    ajax.post(url, { id })
      .then(res => {
        console.log(res)
        data?wx.showToast({
          title: '收藏成功！',
          icon: 'none',
          duration: 2000
        }) : wx.showToast({
          title: '已取消收藏！',
          icon: 'none',
          duration: 2000
        })
      })
  },

  // 显示/隐藏客服弹窗
  changeServiceModal(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({ service: status });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id})
    this.init()
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