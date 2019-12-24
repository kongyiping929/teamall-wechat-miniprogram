// pages/productDetails/productDetails.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    list:"",//产品详情
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
    ],
    userPunchLis:"",
    animationData: {}
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
        let imgUrls = res.data.url.split(",");
        this.setData({ list: res.data, collection: res.data.isCollection, otherParam: JSON.parse(res.data.otherParam), imgUrls });
      }).then(res=>{
        this.findUserPunchList()
      })
    this.setData({ productPackSpecs, productSpecs, productSubdivisionSpecs })

  },
  findUserPunchList() {
    const { list} = this.data;
    ajax.post('/app/product/findUserPunchList', { productId: list.productId, pageSize :1 })
      .then(res => {
        this.setData({ userPunchLis: res.data.list });
      })
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
      productSubdivisionSpecsItem,
      urltype
    } = this.data;
    this.setData({ specPayNum:1})
    if (field === 'productSpecs') {
      let list = productSpecs[index];
      let productSubdivisionSpecsItem = list.lineList.length > 0 ? list.lineList[0] : null;
      let productPackSpecsItem = urltype == 2 ? list.packageList.length > 0 ? list.packageList[0].stockNum > 0 ? list.packageList[0] : null : null : null;
      unitPrice = parseFloat(productSpecs[index].basePrice) + (productPackSpecsItem? parseFloat(productPackSpecsItem.addPrice) : 0) + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice) : 0);
      console.log(productSpecs[index].basePrice, productPackSpecsItem, productSubdivisionSpecsItem )
      
      this.setData({
        productSpecsItem: list,
        unitPrice: parseFloat(unitPrice).toFixed(2),
        productSubdivisionSpecs: list.lineList,
        productSubdivisionSpecsItem,
        productPackSpecsItem,
        productPackSpecs: list.packageList,
      });
    }
    if (field === 'productSubdivisionSpecs') {
      unitPrice = parseFloat(productSubdivisionSpecs[index].addPrice) + (productPackSpecsItem ? parseFloat(productPackSpecsItem.addPrice) : 0) + (productSpecsItem ? parseFloat(productSpecsItem.basePrice) : 0);
      this.setData({
        productSubdivisionSpecsItem: productSubdivisionSpecs.length > 0 ?productSubdivisionSpecs[index]:[],
        unitPrice: parseFloat(unitPrice).toFixed(2),
      });
    }
    if (field === 'productPackSpecs') {
      unitPrice = parseFloat(productPackSpecs[index].addPrice) + (productSpecsItem ? parseFloat(productSpecsItem.basePrice) : 0) + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice) : 0);
      this.setData({
        productPackSpecsItem: productPackSpecs[index],
        unitPrice: parseFloat(unitPrice).toFixed(2),
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
    let that = this;
    this.setData({ specModal: status, urltype, specPayNum: 1 });
    this.specList();
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      if (status){
        that.fadeIn();//调用显示动画
      }else{
        that.fadeDown();//调用显示动画
      }
    }, 200) 
  },
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(600).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  changeAppointment(e) {
    let { urltype } = e.currentTarget.dataset;
    let that = this;
    this.setData({  urltype, specPayNum: 1 });
    this.specList();
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
        that.fadeIn();//调用显示动画
    }, 500) 
  },

  //产品规格列表
  specList (){
    const { id, urltype} = this.data;
    ajax.post('/app/product/findSpecInfo', { id })
      .then(res => {
        let data = res.data.list[0];
        let list = res.data.list;
        let status = false;
        let productSubdivisionSpecsItem = data.lineList.length > 0 ? data.lineList[0] : null;
        let productPackSpecsItem = null;
        let unitPrice = parseFloat(data.basePrice) + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice):0) +(productPackSpecsItem ? parseFloat(productPackSpecsItem.addPrice) :0)
        let disableList = new Set();
        for (let i = 0; i < list.length;i++){
          if (urltype == 1){
            if (list[i].appointmentStatus == 1) { status = true}
          }
          for (let y = 0; y < list[i].packageList.length; y++) {
            if (list[i].packageList[y].stockNum>0){
              disableList.add(list[i].specId)
              if (!productPackSpecsItem){
                urltype == 2 ?productPackSpecsItem = list[i].packageList[y]:"";
              }
            }
          }
        }
        if (status && urltype == 1){
          this.setData({ specModal: true });
        } else if (urltype == 1){
          wx.showToast({
            title: '该产品暂不提供预约体验服务',
            icon: 'none',
            duration: 2000
          });
        }
        this.setData({ 
          specList: res.data.list, 
          productSpecs: res.data.list,
          productSubdivisionSpecs: data.lineList,
          productPackSpecs: data.packageList ,
          productSpecsItem: data,
          productPackSpecsItem,
          productSubdivisionSpecsItem,
          unitPrice: parseFloat(unitPrice).toFixed(2),
          disableList: Array.from(disableList)
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
    if (productPackSpecsItem === null && urltype == 2) return wx.showToast({
      title: '请选择产品包装规格',
      icon: 'none',
      duration: 2000
    });
    let product = {
      productId :id,
      productTypeId: list.productTypeId,
      shopId: productSpecsItem.shopId,
      specId: productSpecsItem.specId,
      specLineId: productSubdivisionSpecsItem?productSubdivisionSpecsItem.id:"",
      specPackageId: productPackSpecsItem?productPackSpecsItem.id:"",
      specPayNum,
      shopName: list.shopName,
    }
    console.log(product)
    wx.navigateTo({
      url: urltype === 1 ? '/pages/confirmMake/confirmMake?item=' + JSON.stringify(product)  :
      '/pages/confirmOrder/confirmOrder?item=' + JSON.stringify(product)  });
    this.setData({ specModal: false });
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
    this.setData({ id: options.id});
    options.inviteCode ? app.globalData.inviteCode = options.inviteCode:"";
    options.shopId ? app.globalData.shopId = options.shopId:"";
    
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(`/pages/productDetails/productDetails?id=${this.data.id}&&shopId=${app.globalData.shopId}&&inviteCode=${this.data.list.inviteCode}`)
    }
    return {
      title: this.data.list.productName,
      path: `/pages/productDetails/productDetails?id=${this.data.id}&&shopId=${app.globalData.shopId}&&inviteCode=${this.data.list.inviteCode}`,
      //imageUrl: this.data.topVideo.image_url,
      success: function (res) {
        wx.showToast({
          title: '分享成功！',
          icon: 'none',
          duration: 2000,
        });
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})