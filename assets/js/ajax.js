const app = getApp();
//const URL = 'http://api.teafunshop.com/cy';
const URL = 'http://119.23.79.12:7001/cy';

let token = wx.getStorageSync('TOKEN')
const openid = wx.getStorageSync('OPENID')

let post = (url, data, toast) => new Promise(reslove => {
  let token = wx.getStorageSync('TOKEN')
  const openid = wx.getStorageSync('OPENID')
  console.log(token, openid)
  const app = getApp();
  wx.showLoading({
    title: '加载中...',
    mask: true
  });
  
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userInfo'] === undefined) {
         wx.redirectTo({
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
              console.log(url, data, token)
              wxRelogin("/app/common/wxRelogin", { openid }).then(res => {
                const pages = getCurrentPages()
                const perpage = pages[pages.length - 1]
                perpage.onLoad()
                perpage.onShow()
                console.log(perpage)
              })
            }

            // 请求异常的提示语
            if (res.data.responseBody.code !== '1' && res.data.responseBody.code !== '-110113') {
              return wx.showToast({
                title: res.data.responseBody.message,
                icon: 'none',
                duration: 2000
              });
            }
            wx.hideLoading();
            // 返回数据
            reslove(res.data.responseBody);
          },
          fail() {
            wx.showToast({
              title: '网络请求超时',
              icon: 'none',
              duration: 2000
            })
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
      console.log(res.data.responseBody.data.loginToken)
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