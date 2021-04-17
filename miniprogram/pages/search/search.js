// miniprogram/pages/search/search.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pagesize: 10
  },
  getKey(e) {
    this.setData({
      keywords: e.detail.value
    })
    this.getList()
  },
  getSearch(e){
    let keywords = e.currentTarget.dataset.key;
    this.setData({
      keywords
    })
    this.getList()
  },
  async getList() {
    let pagesize = this.data.pagesize;
    let skip = (this.data.page - 1) * pagesize;
    console.log(db);
    let res = await db.collection('mini-projectList').where({
      projectName: db.RegExp({
        regexp: this.data.keywords,
        options: 'i'
      })
    }).limit(pagesize).skip(skip).orderBy('addTime', 'desc').get()
    console.log(res);
    this.setData({
      list: res.data
    })
  },
  navigatorTo(e) {
    let {
      type,
      url
    } = e.currentTarget.dataset
    if (type == -1) {
      wx.navigateBack({
        delta: 1,
      })
    }
    if (type == 'order') {
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
        url,
      })
    }
    if (!type) {

      wx.navigateTo({
        url,
      })
    }
  }
})