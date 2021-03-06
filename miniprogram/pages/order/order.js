// miniprogram/pages/order/order.js
let dateTimePicker = require('../../utils/dataTimePicker')
const Api = require('../../utils/api').default;

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
    sum: 0,

    openDate:false
  },
  chooseDate(e){
    console.log(e,666);
  },

  onLoad(options) {
    let {_id} = options
    this.getNowTime()
    this.getInfo(_id)
  },
  async getInfo(_id){
    let res = await Api._findProjectDetail(_id)
    console.log(res);
    this.setData({
      result: res.data,
      sum: res.data.price
    })
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
      dateTimeArray: obj.dateTimeArray,
      chooseTime: Y + '-' + M + '-' + D
    });
    var startT = dateTimePicker.formatPickerDateTime(this.data.dateTimeArray, this.data.dateTime)
    this.setData({
      startT: startT
    })
  },
  //获取时间日期 
  changeDateTime(e) {
    this.setData({
      // dateTime: e.detail.value,
      openDate: true
    })
    // var startT = dateTimePicker.formatPickerDateTime(this.data.dateTimeArray, this.data.dateTime)
    // this.setData({
    //   startT: startT,
    //   startTime: startT,
    // })
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
      sum: this.data.num_text * this.data.result.price
    })
  },
  num_jia() {
    this.data.num_text++;
    this.setData({
      num_text: this.data.num_text,
      num: this.data.num_text,
      sum: this.data.num_text * this.data.result.price
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
  dateSelectAction(e){
    let {year,month,day} = e.detail;
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    this.setData({
      chooseTime: year + '-' + month + '-' + day,
      // openDate: false
    })
    
  },
  closeDate(){
    this.setData({
      openDate: false
    })
  },
  closeDateOk(){
    this.setData({
      openDate: false,
      startTime: this.data.chooseTime
    })
  },
  async submit() {
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
    let projectId = this.data.result._id;
    let res = await Api._addOrders({
      projectId,
      num: this.data.num,
      time: this.data.startTime,
      sum: this.data.sum,
      status: 1,
      clientName: this.data.name,
      phone: this.data.phone,
      desc: this.data.desc
    });
    wx.showToast({
      title: '预约成功',
    })
    setTimeout(()=>{
      wx.switchTab({
        url: '../mine/mine',
      })
    },500)
    console.log(res);
  }
})