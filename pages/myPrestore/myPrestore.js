// pages/myPrestore/myPrestore.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

const selectArr = [];

for (let i = 0; i < 4; i++) {
  if (i === 0) {
    selectArr.push({ status: true, price: 500 });
  } else {
    selectArr.push({ status: false, price: 500 });
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArr, // 选择器
    code:""
  },

  init() {
    let { typeId, searchType, productTypeId } = this.data;
  
    let that = this;
    ajax.post('/app/user/recharge/getdata', {})
      .then(res => {
        this.setData({ selectArr: res.data.dictQuotaListVo, list: res.data.page.list, prechargeBalance: res.data.prechargeBalance })
        console.log(res)
      })
  },

  // 选择数据
  changeSelectArr(e) {
    let { selectArr } = this.data;
    selectArr.forEach(item => {
      item.status = false;
    });
    selectArr[e.currentTarget.dataset.index].status = true;
    console.log(selectArr[e.currentTarget.dataset.index].dictTypeCode)
    this.setData({ selectArr, code: selectArr[e.currentTarget.dataset.index].dictTypeCode});
  },

  recharge(){
    let { code } = this.data;
    let that = this;
    if (!code) return wx.showToast({
      title: "请选择充值金额！",
      icon: 'none',
      duration: 2000
    });
    ajax.post('/app/user/recharge/recharge', { dictTypeCode: code})
      .then(res => {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function (res) {
            console.log(res, res.data)
            wx.showToast({
              title: '订单支付成功',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              that.init();
            }, 800);
          },
          fail: function (res) {
            wx.showToast({
              title: '订单支付失败',
              icon: 'none',
              duration: 2000
            });
          }
        })
        console.log(res)
      })
  },

  // 下拉刷新
  onRefresh(index = 'false') {
    // let { pageId, size, id } = this.data;
    // pageId = 1;
    // ajax.downPost(URLARR[Number(id)], { pageId, size })
    //   .then(({ returnData }) => {
    //     this.setData({
    //       data: returnData.result,
    //       pageId: pageId + 1,
    //       status: returnData.result.length < size ? true : false,
    //     })
    //   })
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