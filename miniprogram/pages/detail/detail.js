// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  navigatorTo(){
    let {
      _openid
    } = wx.getStorageSync('userInfo');
    console.log(_openid);
    if (!_openid) {
      wx.showModal({
        title: '请先登录，是否跳转到登陆页面',
        success: async (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '../mine/mine',
            })
          } else if (res.cancel) {
            return;
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: '../order/order',
    })
  },
  onShareAppMessage: function () {
 
    let url = encodeURIComponent('/miniprogram/pages/detail/detail');
 
    return {
      title: "热点详情",
      path:`/pages/index/index?url=${url}` 
    }
  }
})