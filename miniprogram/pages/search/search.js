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
    }]
  },

  navigatorTo(e){
    if(e.currentTarget.dataset.type == -1){
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})