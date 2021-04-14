// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        imgSrc: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1342227882,3906352906&fm=26&gp=0.jpg',
        title: '快乐套餐',
        arr: '推动血运、健健康康',
        price: 250,
        hasSum: 2,
      },
      {
        imgSrc: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2500729992,1972626005&fm=26&gp=0.jpg',
        title: '和科技和',
        arr: '平平安安，开心快乐，美丽动人',
        price: 100,
        hasSum: 2,
      },
      {
        imgSrc: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1342227882,3906352906&fm=26&gp=0.jpg',
        title: '沐足养生',
        arr: '推动血运、健健康康',
        price: 250,
        hasSum: 2,
      },
      {
        imgSrc: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2500729992,1972626005&fm=26&gp=0.jpg',
        title: '和科技和',
        arr: '平平安安，开心快乐，美丽动人',
        price: 100,
        hasSum: 2,
      }
    ]
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