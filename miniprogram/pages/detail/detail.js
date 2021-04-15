// miniprogram/pages/detail/detail.js
const Api = require('../../utils/api').default;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
  },
  onLoad(options){
    let {_id} = options;
    this.getInfo(_id)
  },
  async getInfo(_id){
    let res = await Api._findProjectDetail(_id)
    console.log(res);
    this.setData({
      result: res.data
    })
  },
  navigatorTo(e){
    let {
      _openid
    } = wx.getStorageSync('userInfo');
    let {_id} = e.currentTarget.dataset
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
      url: '../order/order?_id='+ _id,
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