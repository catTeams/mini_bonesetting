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
    firstFlexContent: [{
        src: 'cloud://ceshi-3gcxvjpd2a3df7c5.6365-ceshi-3gcxvjpd2a3df7c5-1303120065/images/playing.png',
        title: '进行中'
      },
      {
        src: 'cloud://ceshi-3gcxvjpd2a3df7c5.6365-ceshi-3gcxvjpd2a3df7c5-1303120065/images/confirm.png',
        title: '已完成'
      },
      {
        src: 'cloud://ceshi-3gcxvjpd2a3df7c5.6365-ceshi-3gcxvjpd2a3df7c5-1303120065/images/cancel.png',
        title: '已取消'
      }
    ],
    isAdmit: false,
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
    if(_openid == openid){
      orderList = await Api._getOrders({
        status: 1
      })
    }else{
      orderList = await Api._getOrders({
        _openid,
        status: 1
      })
    }
    console.log(orderList);
    await Promise.all(
      orderList.data.map(async item => {
        let res = await Api._findProjectDetail(
          item.projectId)
        console.log(res);
        item.projectName = res.data.projectName
      })
    )
    this.setData({
      orderList: orderList.data
    })
    console.log(orderList);

    return
    // 向数据中添加userInfo属性，便于跳转详情页获取个人信息
    orderList.forEach((item, idx) => {
      orderList[idx] = item.data[0];
    })
    this.setData({
      result: orderList
    })
    return
    // 向数据中添加userInfo属性，便于跳转详情页获取个人信息
    orderList.forEach((item, idx) => {
      orderList[idx] = item.data[0];
    })
    this.setData({
      likeFood: orderList
    })

  },
})