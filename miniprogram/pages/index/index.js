Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    background: ['cloud://ceshi-3gcxvjpd2a3df7c5.6365-ceshi-3gcxvjpd2a3df7c5-1303120065/images/headImg.png', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2500729992,1972626005&fm=26&gp=0.jpg'],
    //设置标记点
    markers: [{
      iconPath: "",
      id: 4,
      latitude: 31.938841,
      longitude: 118.799698,
      width: 30,
      height: 30
    }],
    //当前定位位置
    latitude: '',
    longitude: '',
  },
  navigate() {
    ////使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      latitude: this.data.markers[0].latitude, //要去的纬度-地址
      longitude: this.data.markers[0].longitude, //要去的经度-地址
    })
  },
  onLoad() {
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  }
})