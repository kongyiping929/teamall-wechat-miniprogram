const app = getApp();
const URL = 'https://api.teafunshop.com/cy';
//const URL = 'http://119.23.79.12:7001/cy';

let token = wx.getStorageSync('TOKEN')
const openid = wx.getStorageSync('OPENID')
let isLoading = true;
let time = "";
let post = (url, data, toast) => new Promise(reslove => {
  let token = wx.getStorageSync('TOKEN');
  const openid = wx.getStorageSync('OPENID');
  clearTimeout(time)
  const app = getApp();
  if (isLoading){
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    isLoading = false;
  }
  time = setTimeout(() => {
    isLoading = true;
  }, 1500)
  
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userInfo'] === undefined) {
        wx.navigateTo({
          url: '/pages/getUserInfo/getUserInfo'
        })
      }else{
        wx.request({
          url: URL + url,
          data,
          method: 'POST',
          header: {
            'content-type': 'application/json', // 默认值
            'login_token': token
          },
          success(res) {
            if (!(res.data instanceof Object)) {
              res.data = JSON.parse(Decrypt(res.data));
            }

            // 登录超时
            if (res.data.responseBody.code === '-110113') {
              wx.getLocation({
                success(res) {
                  app.globalData.latitude = res.latitude
                  app.globalData.longitude = res.longitude
                  wx.setStorageSync('latitude', res.latitude)
                  wx.setStorageSync('longitude', res.longitude)
                  wxRelogin("/app/common/wxRelogin", { openid, latitude: res.latitude, longitude: res.longitude}).then(res => {
                    const pages = getCurrentPages()
                    const perpage = pages[pages.length - 1]
                    perpage.onLoad()
                    perpage.onShow()
                  })
                }
              })
            }
            // 请求异常的提示语
            if (res.data.responseBody.code !== '1' && res.data.responseBody.code !== '-110113') {
              if (res.data.responseBody.code == "-200101") {//下架的产品
                return reslove(res.data.responseBody);
              }
              if (res.data.responseBody.code == "-200112") {//有未付款的订单
                return reslove(res.data.responseBody);
              }
              if (res.data.responseBody.code === '-200113') {//有未付款的预约订单
                return reslove(res.data.responseBody);
              }
               return wx.showToast({
                title: res.data.responseBody.message,
                icon: 'none',
                duration: 2000
              });
            }
            // 返回数据
            reslove(res.data.responseBody);
          },
          fail() {
            wx.showToast({
              title: '网络请求超时',
              icon: 'none',
              duration: 2000
            })
          },
          complete() {
            wx.hideLoading();
          }
        })
      }
    }
  })
  
});
//再次登录
let wxRelogin = (url, data) => new Promise(reslove => {
  let token = wx.getStorageSync('TOKEN')
  const openid = wx.getStorageSync('OPENID')
  wx.request({
    url: URL + url,
    data,
    method: 'POST',
    header: {
      'content-type': 'application/json', // 默认值
      'login_token': token
    },
    success(res) {
      if (res.data.responseBody.code === '-100002') {
        wx.navigateTo({
          url: '/pages/getUserInfo/getUserInfo'
        })
      }
      
      token = res.data.responseBody.data.loginToken;
      wx.setStorageSync('TOKEN', res.data.responseBody.data.loginToken)
      reslove(res.data.responseBody);
    },
  })
});
let downPost = (url, data) => new Promise(reslove => {
  // 显示顶部刷新图标
  wx.showNavigationBarLoading();
  wx.showLoading({
    title: '加载中...',
  });
  wx.request({
    url: URL + url,
    data,
    method: 'POST',
    header: {
      'content-type': 'application/json', // 默认值
      'TOKEN': app.globalData.TOKEN
    },
    success(res) {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      // 登录超时
      if (res.data.returnCode === '200002' || res.data.returnCode === '200003') {
        app.onLaunch()
      }
      // 请求异常的提示语
      if (res.data.returnCode !== '000000') return wx.showToast({
        title: res.data.returnMsg,
        icon: 'none',
        duration: 2000
      });
      // 登录成功设置token
      if (url === '/app/common/login') {
        app.globalData.TOKEN = res.data.returnData.token;
      }
      wx.hideLoading();
      // 返回数据
      reslove(res.data);
    },
    fail() {
      wx.showToast({
        title: '网络请求超时!',
        icon: 'none',
        duration: 2000
      })
    }
  })
});

module.exports = {
  post,
  downPost,
  URL
}