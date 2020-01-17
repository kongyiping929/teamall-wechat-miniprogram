// pages/confirmOrder/confirmOrder.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    remark: "", // 备注
    coupon: null,//优惠券
    couponActive:null,
    couponModal: false, // 优惠券模态框 true 显示 false 隐藏
    addPersonStatus: false, // 添加地址模态框
    passenger: [], // 旅客信息
    travellerPerson: [], // 收件人列表
    consignee: null, // 收件人地址对象
    item:"",//规格参数
    specPayNum: 1, // 购买数量
    receiveType :1,//取货方式
    payChannel :1,//支付默认微信
    imgList: [
      "/assets/image/confirmMake/selectActive.png",
      "/assets/image/confirmMake/select.png",
    ],
    disableList:[],
    animationData: {}
  },

  // 更改备注
  changeRemark(e) {
    this.setData({ remark: e.detail.value });
  },

  // 显示隐藏优惠券模态框
  changeCouponModal(e) {
    this.setData({ couponModal: e.currentTarget.dataset.status });
  },

  couponChange(e){
    this.setData({ couponActive: e.currentTarget.dataset.item, couponModal: false });
  },


  // 跳转添加地址
  goAddAddress(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/addAddress/addAddress?item=${item ? JSON.stringify(item) : ''}`
    })
  },

  // 更改收货人
  changeRecipients(e) {
    let { item } = e.currentTarget.dataset;
    //let { freightArr } = this.data;
    //let freightPrice = freightArr.filter(item => item.areaName === contactAddress)[0];
    this.setData({ consignee: item, addPersonStatus: false })
  },

  // 显示/隐藏地址模态框
  changeAddPersonStatus(e) {
    let status = e.currentTarget.dataset.status;
    if (status) {
      // ajax.post('/app/address/getlist')
      //   .then(res => {
      this.setData({
        addPersonStatus: status,
        // travellerPerson: res.returnData
      })
      //   })
    } else {
      this.setData({
        addPersonStatus: status
      })
    }
  },
  stopEvent(e) {}, // 防止冒泡

  init(){
    const { productId, userId } = this.data;
    ajax.post('/app/user/manage/getshopproductinfo', { productId, userId, shopId: app.globalData.shopId  })
      .then(res => {
        this.setData({ list: res.data})
        this.specList()
      })
  },

  // 显示/隐藏产品规格模态框
  changeSpecModal(e) {
    let that = this;
    let { status } = e.currentTarget.dataset;
    this.setData({ specModal: status});
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      if (status) {
        that.fadeIn();//调用显示动画
      } else {
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
  //产品规格列表
  specList() {
    const { list } = this.data;
    ajax.post('/app/product/findSpecInfo', { id:list.productId })
      .then(res => {
        let data = res.data.list[0];
        let list = res.data.list;
        let productSubdivisionSpecsItem = data.lineList.length > 0 ? data.lineList[0] : null;
        let productPackSpecsItem = null;
        for (let i = 0; i < list.length; i++) {
          for (let y = 0; y < list[i].packageList.length; y++) {
            list[i].disable = true;
            if (list[i].packageList[y].stockNum > 0) {
              list[i].disable = false;
              if (!productPackSpecsItem) {
                productPackSpecsItem = list[i].packageList[y];
              }
            }
          }
        }
        let unitPrice =( parseFloat(data.basePrice)*100 + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice)*100 : 0) + (productPackSpecsItem ? parseFloat(productPackSpecsItem.addPrice)*100 : 0))/100
        this.setData({
          specList: res.data.list,
          productSpecs:list,
          productSubdivisionSpecs: data.lineList,
          productPackSpecs: data.packageList,
          productSpecsItem: data,
          productPackSpecsItem,
          productSubdivisionSpecsItem,
          unitPrice,
        });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ productId: options.productId, userId: options.userId });
    this.init();
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
  changPayChannel(){
    this.setData({ payChannel: this.data.payChannel==0?1:0})
  },

  changReceiveType(){
    this.setData({ receiveType: this.data.receiveType==0?1:0})
  },

  submitOrder(){
    const { payChannel, remark, productSpecsItem, productPackSpecsItem, productSubdivisionSpecsItem, userId, productId, list, specPayNum} = this.data;
    let data = {
      payChannel: payChannel+1,
      productId,
      productTypeId: list.productTypeId,
      shopId: app.globalData.shopId,
      specId: productSpecsItem.specId ,
      specLineId:  productSubdivisionSpecsItem?productSubdivisionSpecsItem.id:"",
      specPackageId: productPackSpecsItem?productPackSpecsItem.id:"",
      userId,
      buyNum: specPayNum,
      receiveType :1,
      remark
    }
    ajax.post('/app/user/manage/sendOrder', data)
      .then(res => {
          wx.showToast({
            title: '订单确认成功',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 2,
            })
          }, 800);
        
        
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
    this.setData({ specPayNum: 1 })
    if (field === 'productSpecs') {
      let list = productSpecs[index];
      let productSubdivisionSpecsItem = list.lineList.length > 0 ? list.lineList[0] : null;
      let productPackSpecsItem = null ;
      if (list.packageList.length > 0) {
        for (let y = 0; y < list.packageList.length; y++) {
          if (list.packageList[y].stockNum > 0) {
            productPackSpecsItem ? "":productPackSpecsItem = list.packageList[y]
          }
        }
      }
      unitPrice = (parseFloat(productSpecs[index].basePrice)*100 + (productPackSpecsItem ? parseFloat(productPackSpecsItem.addPrice)*100 : 0) + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice)*100 : 0))/100;

      this.setData({
        productSpecsItem: list,
        unitPrice: unitPrice,
        productSubdivisionSpecs: list.lineList,
        productSubdivisionSpecsItem,
        productPackSpecsItem,
        productPackSpecs: list.packageList,
      });
    }
    if (field === 'productSubdivisionSpecs') {
      unitPrice = (parseFloat(productSubdivisionSpecs[index].addPrice)*100 + (productPackSpecsItem ? parseFloat(productPackSpecsItem.addPrice)*100 : 0) + (productSpecsItem ? parseFloat(productSpecsItem.basePrice) *100: 0))/100;
      this.setData({
        productSubdivisionSpecsItem: productSubdivisionSpecs.length > 0 ? productSubdivisionSpecs[index] : [],
        unitPrice: unitPrice,
      });
    }
    if (field === 'productPackSpecs') {
      unitPrice = (parseFloat(productPackSpecs[index].addPrice)*100 + (productSpecsItem ? parseFloat(productSpecsItem.basePrice)*100 : 0) + (productSubdivisionSpecsItem ? parseFloat(productSubdivisionSpecsItem.addPrice)*100 : 0))/100;
      this.setData({
        productPackSpecsItem: productPackSpecs[index],
        unitPrice: unitPrice,
      });
    }
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