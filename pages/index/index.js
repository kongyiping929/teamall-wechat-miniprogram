//index.js
//获取应用实例
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

const navList = [
  {
    src: '/assets/image/index/newReleases.png',
    text: '最新上架',
    path: '/pages/productList/productList?type=0'
  },
  {
    src: '/assets/image/index/festivalGift.png',
    text: '佳节礼品',
    path: '/pages/productList/productList?type=1'
  },
  {
    src: '/assets/image/index/preferentialConstantly.png',
    text: '优惠不断',
    path: '/pages/productList/productList?type=2'
  },
  {
    src: '/assets/image/index/productClassification.png',
    text: '产品分类',
    path: '/pages/productType/productType'
  }
]

Page({
  data: {
    latitude: '', // 纬度
    longitude: '', // 经度
    navList, // 菜单列表
    shopName: '定位中', // 店铺名称
    cityName: '', // 城市名称
    currentShopNum:0,//打卡次数
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    newList:''
  },

  // 初始化
  init() {
    let { latitude, longitude } = this.data;
    let that = this;
    ajax.post('/app/index/findCurrentShop', { latitude, longitude })
      .then(res => {
        console.log(res)
        this.setData({ shopName: res.data.shopName, cityName: res.data.cityName });
        app.globalData.shopId = res.shopId
      }).then(()=>{
        that.productTypeList()
      })
  },

  // 首页所有产品
  productTypeList() {
    let data = {
      "pageSize": 4,
      "shopId": 1,
      "showType": 1,
    }
    let { latitude, longitude } = this.data;
    ajax.post('/app/index/findProductInfo',{...data})
      .then(res => {
        console.log(res)
        this.setData({ newList: res.data.list});
      })
  },
  // 跳转店铺地址
  goShopList(e) {
    wx.navigateTo({ url: '/pages/shopList/shopList?cityName=' + this.data.cityName });
  },

  onLoad: function () {
    let that = this;
    wx.getLocation({
      success(res) {
        console.log(res)
        that.setData({ latitude: res.latitude, longitude: res.longitude }, () => that.init())
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
      }
    })
  },
  
  // 跳转每日打卡
  goDayCard(e) {
    wx.navigateTo({ url: '/pages/dayCard/dayCard' })
  },
  getUserInfo(e) {
    console.log(e)
  },
  openSetting(e) {
    console.log(e)
  },
  IsAuthority: function () {
    if (wx.canIUse('button.open-type.getUserInfo')) {
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  authority: function (e) {
    console.log(wx.canIUse('button.open-type.getUserInfo'))
    if (JSON.stringify(e.detail).indexOf("userInfo") != -1) {
      const data = {
        _cmd: 'usercenter_updateUserInfo',
        photo_url: e.detail.userInfo.avatarUrl,
        nick_name: encodeURI(e.detail.userInfo.nickName)
      }
      app.httpsReq(data, (da) => {
        if (e.currentTarget.dataset.my == 1) {
          wx.navigateTo({ url: "../../mine/my/my" })
        } else {
          this.setData({ comment_cont_show: true, mask_show: true });
          this.comment_list();
        }
      })
    }
  },
})
