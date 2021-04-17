// miniprogram/pages/mine/index.js
const Api = require('../../utils/api').default;
import {
  openid
} from '../../utils/config.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {},
    isAdmit: false,
    status: 1,
    showModal: false,
    followFlag: true,
    followSubmitCheck: true,
  },
  onLoad() {
    this._isLogin();
  },
  //判断是否登录状态
  _isLogin() {
    // 获取当前用户userInfo
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        isLogin: true,
        userInfo
      })
      this._getOrder()
      let {
        _openid
      } = userInfo;
      if (_openid == openid) {
        this.setData({
          isAdmit: true
        })
      }
    } else {
      this.setData({
        isLogin: false
      })
    }
  },
  // 登录操作
  async _getInfo(e) {
    let _this = this
    wx.getSetting({
      success: res => {
        console.log("--获取用户信息---")
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log("--getUserInfo---")
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              let userInfo = res.userInfo;
              wx.login({
                success: async () => {
                  // 云函数获取当前用户的openid
                  let res = await wx.cloud.callFunction({
                    name: "login"
                  })
                  console.log(res);
                  // return
                  let _openid = res.result.openid;
                  // 定义一个变量接收需要存储的个人信息
                  let data = {
                    _openid,
                    avatarUrl: userInfo.avatarUrl,
                    nickName: userInfo.nickName
                  }
                  // 存储到storage
                  wx.setStorageSync('userInfo', data);
                  // return
                  // 查询是否有该用户
                  console.log(_openid);
                  // return
                  let hasUsersRes = await Api._hasUsers({
                    _openid
                  })
                  console.log(hasUsersRes);
                  // 数据表里没有该用户则新增
                  if (hasUsersRes.data.length <= 0) {
                    await Api._addUsers({
                      avatarUrl: userInfo.avatarUrl,
                      nickName: userInfo.nickName
                    })
                  } else { //修改用户信息
                    await Api._editUsers({
                      _openid
                    }, {
                      avatarUrl: userInfo.avatarUrl,
                      nickName: userInfo.nickName
                    })
                  }
                  _this.setData({
                    isLogin: true,
                    userInfo: data,
                    _openid
                  })

                  this._isLogin()
                }
              })
            }
          })
        }
      }
    })
    return

    // console.log(e);

  },
  navigatorTo(e) {
    let {
      url
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url,
    })
  },
  // 获取订单
  async _getOrder() {
    // 通过当前openid获取
    let _openid = this.data.userInfo._openid;
    let orderList = []
    let orderPlaying = [];
    let orderConfirm = [];
    let orderCancel = [];
    if (_openid == openid) {
      orderPlaying = await Api._getOrders({
        status: 1
      })
      await Promise.all(
        orderPlaying.data.map(async item => {
          let res = await Api._findProjectDetail(
            item.projectId)
          console.log(res);
          item.projectName = res.data.projectName
        })
      )
      orderConfirm = await Api._getOrders({
        status: 2
      })
      await Promise.all(
        orderConfirm.data.map(async item => {
          let res = await Api._findProjectDetail(
            item.projectId)
          console.log(res);
          item.projectName = res.data.projectName
        })
      )
      orderCancel = await Api._getOrders({
        status: 3
      })
      await Promise.all(
        orderCancel.data.map(async item => {
          let res = await Api._findProjectDetail(
            item.projectId)
          console.log(res);
          item.projectName = res.data.projectName
        })
      )
    } else {
      orderPlaying = await Api._getOrders({
        _openid,
        status: 1
      })
      orderPlaying.data.map(async item => {
        let res = await Api._findProjectDetail(
          item.projectId)
        console.log(res);
        item.projectName = res.data.projectName
      })
      orderConfirm = await Api._getOrders({
        _openid,
        status: 2
      })
      orderConfirm.data.map(async item => {
        let res = await Api._findProjectDetail(
          item.projectId)
        console.log(res);
        item.projectName = res.data.projectName
      })
      orderCancel = await Api._getOrders({
        _openid,
        status: 3
      })
      orderCancel.data.map(async item => {
        let res = await Api._findProjectDetail(
          item.projectId)
        console.log(res);
        item.projectName = res.data.projectName
      })
    }

    this.setData({
      orderList: orderPlaying.data,
      orderPlaying: orderPlaying.data,
      orderConfirm: orderConfirm.data,
      orderCancel: orderCancel.data,
    })


  },
  async changeStatus(e) {
    let {
      status
    } = e.currentTarget.dataset;
    this.setData({
      status
    });
    let {
      orderList,
      orderPlaying,
      orderConfirm,
      orderCancel
    } = this.data
    if (this.data.status == 1) {
      orderList = orderPlaying
    } else if (this.data.status == 2) {
      orderList = orderConfirm
    } else if (this.data.status == 3) {
      orderList = orderCancel
    }

    this.setData({
      orderList: orderList
    })
    console.log(orderList);
    // this._getOrder()
  },
  async changeOrder(e) {
    let {
      _id,
      status
    } = e.currentTarget.dataset;
    status = parseInt(status)
    if (status == 3) {
      this.setData({
        orderStatus: status,
        orderId: _id,
        showModal: true,

      })
      return
    }
    await Api._editOrders(_id, {
      status
    })
    this._getOrder()
  },
  // 赋值跟进内容
  changeText(e) {
    this.setData({
      followText: e.detail.value,
    });
    console.log(this.data.followText)
    this.data.logDescription = this.data.followText
  },
  // 隐藏跟进弹框
  hideModal: function () {
    this.setData({
      showModal: false,
    });
  },
  // 确认
  onConfirm: async function () {
    console.log(this.data.followFlag)
    if (!this.data.followFlag) return
    this.setData({
      followFlag: false
    })
    if (!this.data.followText) {
      wx.showToast({
        title: '取消原因不能为空！',
        icon: 'none'
      })
      this.setData({
        followFlag: true
      })
      return
    }
    if (this.data.followSubmitCheck) {
      this.setData({
        followSubmitCheck: false
      });
      if (this.data.logDescription) {
        console.log(this.data.orderId);
        
        let data = {
          status: this.data.orderStatus,
        }
        if(this.data.isAdmit){
          data.logDescription = this.data.logDescription
        }else{
          data.clientLogDescription = this.data.logDescription
        }
        await Api._editOrders(this.data.orderId, data)
        this._getOrder()
        this.setData({
          followSubmitCheck: true,
          followFlag: true,
          followText: "",
          showModal: false
        })
      }
    }


  },
  getPhone(e) {
    let {
      phone
    } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
})