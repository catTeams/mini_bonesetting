// miniprogram/pages/appointment/appointment.js
const Api = require('../../utils/api').default;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentIndex: 0,
    list: [],
    menusId: '',
    pagesize: 10,
    page: 1,
  },
  onLoad() {
    this.getList()
  },
  navigatorTo(e) {
    let {
      type,
      url,
      _id
    } = e.currentTarget.dataset;
    if (type) {
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
    }
    wx.navigateTo({
      url: url + '?_id=' + _id,
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      // currentTab: e.detail.current,
      currentIndex: e.detail.current
    });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {

    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        currentIndex: e.detail.current
      })
    }
  },
  // 获取列表
  async getList() {
    let menusId = this.data.menusId;
    let {
      _openid
    } = wx.getStorageSync('userInfo');
    // if (!this.data.isMore) {
    //   return
    // }
    wx.showLoading({
      title: '正在请求...',
    })
    let pagesize = this.data.pagesize;
    let skip = (this.data.page - 1) * pagesize;
    let data = {
      status: 1,
      _openid
    }
    if (menusId) {
      data.menusId = menusId
    }
    let res = await Api._getProjectList(data, pagesize, skip, 'addTime', 'desc');
    wx.hideLoading()
    // if (res.data.length == 0) {
    //   if (this.data.foodList.length == 0) {
    //     this.setData({
    //       isNone: true
    //     })
    //   } else {
    //     this.setData({
    //       isMore: false
    //     })
    //   }

    //   wx.showToast({
    //     title: '没有更多了',
    //     icon: 'none'
    //   })
    // }
    // 根据openid找到对应用户
    let list = res.data.map(async item => {
      return await Api._hasUsers({
        _openid: item._openid
      });
    })
    list = await Promise.all(list);
    list.forEach((item, idx) => {
      res.data[idx].userInfo = item.data[0]
    })
    this.setData({
      list: this.data.list.concat(res.data)
    })
  },
})