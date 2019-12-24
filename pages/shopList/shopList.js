// pages/shopList/shopList.js
const QQMapWX = require('../../assets/js/qqmap-wx-jssdk.js');
const ajax = require('../../assets/js/ajax.js');
const app = getApp()
let qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '', // 深圳市
    cityName: '', // 城市名称
    nearbyShopList: '',
    allShopList: '',
  },

  // 选择店铺
  selectStore(e) {
    ajax.post('/app/index/updCurrentShop', { id: e.currentTarget.dataset.item.shopId})
      .then(res => {
        wx.setStorageSync('SHOP', e.currentTarget.dataset.item)
        app.globalData.shopId = e.currentTarget.dataset.item.shopId;
        app.globalData.shop = e.currentTarget.dataset.item;
        wx.switchTab({ url: `/pages/index/index` })
      })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this;
    // 实例化API核心类
    // qqmapsdk = new QQMapWX({
    //   key: 'NGLBZ-KGGCU-Z7BV6-2KGHP-C7TO5-WJFVO'
    // });
    // 获取用户地理位置
    // wx.getLocation({
    //   success(res) {
    //     if (res.errMsg !== 'getLocation:ok') return;
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       },
    //       success(ret) {
    //         if (ret.status !== 0) return;
    //         that.setData({ city: ret.result.address_component.city })
    //       },
    //       fail(err) {
    //         console.log(err)
    //       }
    //     })
    //   }
    // })
    this.setData({ cityName: options.cityName }, () => this.init());
  },
  // 初始化
  init() {
    let latitude = wx.getStorageSync('latitude')
    let longitude = wx.getStorageSync('longitude')
    let { cityName } = this.data;
    let that = this;
    ajax.post('/app/index/findNearbyShop', { latitude, longitude, cityName })
      .then(res => {
        this.setData({ nearbyShopList: res.data });
      }).then(() => {
        ajax.post('/app/index/findAllShop', { latitude, longitude, cityName })
          .then(res => {
            console.log(res.data)
            this.setData({ allShopList: res.data });
          })
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