// miniprogram/pages/order/order.js
let dateTimePicker = require('../../utils/dataTimePicker')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateTime: '',
    dateTimeArray: '',
    startT: '',
    startTime: '请选择',
    num: 1,
    num_text: 1,
    sum: 140,
  },
  onLoad() {
    this.getNowTime()
  },
  // 获取当前时间
  getNowTime: function (e) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
    var hour = date.getHours()
    hour = hour < 10 ? '0' + hour : hour
    var minute = date.getMinutes()
    minute = minute < 10 ? '0' + minute : minute
    var second = date.getSeconds()
    second = second < 10 ? '0' + second : second
    console.log(Y + '-' + M + '-' + D + ' ' + hour + ':' + minute + ':' + second);
    var start = Y + '-' + M + '-' + D + ' ' + hour + ':' + minute + ':' + second;
    var obj = dateTimePicker.dateTimePicker(Y - 10, Y + 10, start);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray
    });
    var startT = dateTimePicker.formatPickerDateTime(this.data.dateTimeArray, this.data.dateTime)
    this.setData({
      startT: startT
    })
  },
  //获取时间日期 
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    })
    var startT = dateTimePicker.formatPickerDateTime(this.data.dateTimeArray, this.data.dateTime)
    this.setData({
      startT: startT,
      startTime: startT,
    })
  },
  changeNum(e) {
    if (e.detail.value <= 1) {
      this.setData({
        num_text: 1
      })

    }
    this.setData({
      num: e.detail.value
    })
  },
  num_jian() {
    if (this.data.num_text <= 1) {
      return
    }
    this.data.num_text--
    this.setData({
      num_text: this.data.num_text,
      sum: this.data.num_text * 140
    })
  },
  num_jia() {
    this.data.num_text++;
    this.setData({
      num_text: this.data.num_text,
      sum: this.data.num_text * 140
    })
  },
  changeName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  changePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  changeDesc(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  submit() {
    if (this.data.startTime == '请选择') {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return
    }
    if (!this.data.name) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    } else {
      let result = this.data.phone.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
      if (!result) {
        wx.showToast({
          title: '手机号格式有误',
          icon: 'none'
        })
      return
      }
    }
    wx.redirectTo({
      url: '../index/index',
    })
  }
})