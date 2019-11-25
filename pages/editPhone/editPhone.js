// pages/editPhone/editPhone.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeTip: '获取验证码',
    phone: '', // 手机号
    code: '', // 邀请码
    invitation: '', // 邀请码
    first: '', // 是否为邀请 无-更绑手机号 undefined-第一次登陆
  },

  // 获取验证码
  getCode() {
    let { phone } = this.data;
    if (!/^\d{5,}$/.test(phone)) return wx.showToast({
      title: '手机号码输入有误',
      icon: 'none',
      duration: 2000
    });
    if (this.data.codeTip !== '获取验证码') return;
    let timer = null;
    let num = 60;
    this.setData({ codeTip: '已发送' })
    ajax.post('/app/user/center/sendcode', { phone: phone }, 'redBag')
      .then(({ returnCode, returnData, returnMsg }) => {
        // if (returnCode !== '000000') {
        //   this.setData({ codeTip: '获取验证码' })
        //   return wx.showToast({
        //     title: returnMsg,
        //     icon: 'none',
        //     duration: 2000
        //   });
        // }
        timer = setInterval(() => {
          if (num === 0) {
            clearInterval(timer)
            this.setData({ codeTip: '获取验证码' })
          } else {
            num--;
            this.setData({ codeTip: `${num}秒后重发` })
          }
        }, 1000)
      })
  },

  // 更改字段
  changeField(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value })
  },
  changeInvitation(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value })
  },
  // 注册
  submit() {
    let { phone, code, invitation } = this.data;
    if (!/^\d{5,}$/.test(phone)) return wx.showToast({
      title: '手机号码输入有误',
      icon: 'none',
      duration: 2000
    });
    if (!/^\d{4}$/.test(code)) return wx.showToast({
      title: '4位验证码输入有误',
      icon: 'none',
      duration: 2000
    });
    ajax.post('/app/user/center/updphone', { code, phone: phone, invitation })
      .then(({ returnData }) => {
        wx.showToast({
          title: '更绑手机成功',
          icon: 'none',
          duration: 2000
        });
        if (app.changePhone) {
          app.changePhone();
        }
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 800)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { first } = options;
    if (first !== '无') {
      wx.setNavigationBarTitle({
        title: '绑定手机号'
      })
    }
    this.setData({ first });
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