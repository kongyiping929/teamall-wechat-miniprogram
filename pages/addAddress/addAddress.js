// pages/addAddress/addAddress.js
const app = getApp()
const ajax = require('../../assets/js/ajax.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    status: false, // 默认状态
    regionId: '', // 省市区ID
    recipients: '', // 收件人
    phone: '', // 手机号
    address: '', // 详细地址
    regionId:""
  },

  // 更改字段
  changeField(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value })
  },

  // 更改滑块
  changeSwitch(e) {
    this.setData({ status: e.detail.value });
  },

  // 省市区
  regionChange: function(e) {
    console.log(e.detail.id)
    this.setData({ regionId: e.detail.id })
  },

  // 保存
  handle() {
    let {
      status,
      region,
      recipients,
      phone,
      address,
      id,
      regionId
    } = this.data;
    address = address.trim();
    if (recipients.trim().length === 0) return wx.showToast({
      title: '收货人不能为空',
      icon: 'none',
      duration: 2000
    });
    if (phone.length !== 11) return wx.showToast({
      title: '收货人手机号码为11位',
      icon: 'none',
      duration: 2000
    });
    console.log(regionId)
    if (!regionId) return wx.showToast({
      title: '请选择省市区',
      icon: 'none',
      duration: 2000
    });
    if (address.length === 0) return wx.showToast({
      title: '详细地址不能为空',
      icon: 'none',
      duration: 2000
    });
    let data = {
      provinceId: regionId[0],
      cityId : regionId[1],
      districtId : regionId[2],
      consignee : recipients,
      mobile : phone,
      detailAddress: address,
      defaultStatus : status ? 1 : 2
    }
    if (id) data.id = id;
    ajax.post('/app/user/address/saveOrEdit', data)
      .then(res => {
        wx.showToast({
          title: `${!id ? '添加成功' : '修改成功'}`,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
            success() {
              if (app.refreshAddress) {
                app.refreshAddress()
              }
            }
          })
        }, 800)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      item
    } = options;
    console.log(item, item == "")
    if (!item) {
      wx.setNavigationBarTitle({
        title: '添加收货地址'
      })
    } else {
      let {
        id,
        defaultStatus,
        detailAddress,
        consignee,
        mobile, provinceId, cityId, districtId
      } = JSON.parse(item);
      let status = defaultStatus == 1 ? true : false;
    
      this.setData({
        id,
        status,
        regionId: [provinceId, cityId, districtId],
        address: detailAddress,
        phone: mobile,
        recipients: consignee
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})