// pages/dayCard/dayCard.js
const ajax = require('../../assets/js/ajax.js');
var timestamp = Date.parse(new Date()) / 1000;
timestamp = timestamp + ".jpg"; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:0,//打卡次数
    productTypeArr: ['加载中'], // 产品类型数组
    productTypeIndex: 0, // 产品类型选中下标
    squareId:0,
    productId: '', // 广场
    remark: '', // 编辑文字
    userImage: [], // 用户选择的图片
    imgList:[],//服务器返回的图片集合
    modal: false, // 打卡模态框
    couponModal:"",//优惠券
    shopInfo:"",//打卡商品
  },

  // 筛选器
  bindPickerChange: function (e) {
    const { productTypeArr} = this.data;
    this.setData({
      productTypeIndex: e.detail.value,
      squareId: productTypeArr[e.detail.value].squareId
    })
  },

  // 选择图片
  selectImage(e) {
    let that = this;
    let { userImage, imgList } = that.data;
    if (userImage.length > 2) return;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths)
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            userImage.push({ fileBase64Content: 'data:image/png;base64,' +res.data, fileName: timestamp})
            that.setData({ userImage });
            ajax.post('/common/file/upload', { fileBase64Content: res.data, fileName: timestamp })
              .then(res => {
                console.log(res.data)
                imgList.push({ url: res.data, name : timestamp })
              })
          }
        })
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
    wx.navigateBack({ delta: 1 });
  },

  // 初始化
  init() { 
    let that = this;
    ajax.post('/app/user/punch/preInfo',{})
      .then(res => {
        that.setData({
          shopInfo: Object.keys(res.data).length > 0 ? res.data:"" ,
        }, () => { console.log(""?true:false)})
        return res.data;
      }).then(shopInfo=>{
        ajax.post('/app/microSquare/findMicroSquareList', { pageSize: 9999 })
          .then(res => {
            let productTypeArr= res.data.list
            if (Object.keys(shopInfo).length > 0){
              for (let i = 0; i < productTypeArr.length; i++) {
                if(productTypeArr[i].squareId == shopInfo.squareId){
                  that.setData({
                    productTypeArr,
                    productTypeIndex: i,
                    squareId: shopInfo.squareId
                  })
                }
              }
            }else{
              that.setData({
                productTypeArr,
                squareId: res.data.list[0].squareId
              })
            }
          })
      })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ count: options.count})
    this.init();
  },

  save(){
    let { squareId, remark, imgList, shopInfo} = this.data;
    if (remark.length < 15) return wx.showToast({
      title: "输入内容需15-200个字符",
      icon: 'none',
      duration: 2000
    });
    if (imgList.length < 1) return wx.showToast({
      title: "图片未上传",
      icon: 'none',
      duration: 2000
    });
    let data = {
      content: remark,
      squareId,
      attachmentInfoList: imgList,
      orderId: shopInfo ? shopInfo.orderId:""
    }
    ajax.post('/app/user/punch/save', data)
      .then(res => {
        console.log(res)
        this.setData({ modal: true, couponModal: Object.keys(res.data).length > 0 ? res.data : "",})
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