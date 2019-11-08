const app = getApp();
//const URL = 'http://api.teafunshop.com/cy';
const URL = 'http://119.23.79.12:7001/cy';
console.log(getApp())
let post = (url, data, toast) => new Promise(reslove => {
    const app = getApp();
    wx.showLoading({
        title: '加载中...',
        mask: true
    });
  console.log(getApp())
  app.globalData.TOKEN = 'fabd5bc52f884b33956e2ed048ede985';
  if (!app || (!app.globalData.TOKEN || app.globalData.TOKEN === '')) return wx.navigateTo({ url: '/pages/getUserInfo/getUserInfo' });
    wx.request({
        url: URL + url,
        data,
        method: 'POST',
        header: {
            'content-type': 'application/json', // 默认值
             'TOKEN': app.globalData.TOKEN
        },
        success(res) {
            if (!(res.data instanceof Object)) {
                res.data = JSON.parse(Decrypt(res.data));
            }
            // 登录超时
            if (res.data.code === '200002' || res.data.code === '200003') {
                app.globalData.tokenState = true;
                app.onLaunch();
            }

            // 请求异常的提示语
            if (toast !== 'redBag' && res.data.code !== '200') {
                return wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 2000
                });
            }

            // 登录成功设置token
            if (url === '/app/common/login') {
                app.globalData.TOKEN = res.data.returnData.token;
            }
            wx.hideLoading();
          console.log(res.data.responseBody)
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