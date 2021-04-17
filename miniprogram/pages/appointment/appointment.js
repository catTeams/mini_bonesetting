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
    menusList: [{
      typeName: '全部',
      _id: ''
    }]
  },
  onLoad() {
    this.getList();
    this.getMenusList()
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
    console.log(e);
    let item = this.data.menusList[e.detail.current]
    this.setData({
      // currentTab: e.detail.current,
      currentIndex: e.detail.current,
      list: [],
      menusId: item._id
    });
    if(e.detail.source == ''){
      return
    }
    this.getList()
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log(123123123123123);
    var cur = e.target.dataset.current;
    let {
      item
    } = e.currentTarget.dataset
    console.log(item);
    this.setData({
      menusId: item._id
    })
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        currentIndex: e.detail.current,

      })
    }
    this.setData({
      list: []

    })
    this.getList()
  },
  // 渲染分类数据
  async getMenusList() {
    let res = await Api._findClassItem({
      status: 1
    });
    console.log(res);
    let menusList = this.data.menusList.concat(res.data)
    this.setData({
      menusList
    })


  },
  // 获取列表
  async getList() {
    let menusId = this.data.menusId;
    console.log(menusId);
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
    }
    if (menusId) {
      data.menusId = menusId
    }
    let res = await Api._getProjectList(data, pagesize, skip, 'addTime', 'desc');
    console.log(res.data);
    wx.hideLoading()
    this.setData({
      list: this.data.list.concat(res.data)
    })
  },
})