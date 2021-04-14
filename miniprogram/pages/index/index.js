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
      latitude: 22.70941162109375,
      longitude: 114.04393768310547,
      name: '黄义森正骨颈椎腰椎跌打骨伤',
      address: '广东省深圳市龙华区江围路宝志国商业楼I5号',
    }],
    //当前定位位置
    latitude: '',
    longitude: '',
    showWx: false,
    oneButton: [{
      text: '确定'
    }],
  },
  openWx(e) {
    this.setData({
      showWx: true
    })
  },
  closeWx() {
    this.setData({
      showWx: false
    })
  },
  // 复制客户编号
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  showInput() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  navigate() {
    ////使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      latitude: this.data.markers[0].latitude, //要去的纬度-地址
      longitude: this.data.markers[0].longitude, //要去的经度-地址
      name: this.data.markers[0].name,
      address: this.data.markers[0].address,
    })
  },
  getLocation() {
    let _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (location) {
        _this.setData({
          latitude: location.latitude,
          longitude: location.longitude
        })
      },
      fail: function () {
        wx.hideLoading();

        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              _this.showModal({
                title: '',
                content: '请允许****获取您的定位',
                confirmText: '授权',
                success: function (res) {
                  if (res.confirm) {

                    _this.openSetting();
                  } else {
                    console.log('get location fail');
                  }
                }
              })
            } else {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              _this.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定',
                success: function (res) {}
              })
            }
          }
        })
      }
    })
  },
  onLoad() {
    this.getLocation()
  },
  getPhone(e) {
    let {
      phone
    } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  navigatorTo(e){
    let {url} = e.currentTarget.dataset;
    wx.navigateTo({
      url,
    })
  }
})