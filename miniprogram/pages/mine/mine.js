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
    firstFlexContent: [
    {
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
    }]
  },
  onLoad(){
    this._isLogin()
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
    } else {
      this.setData({
        isLogin: false
      })
    }
  },
  // 登录操作
  async _getInfo(e) {
    //获取用户信息
    let userInfo = e.detail.userInfo;
    // console.log(e);
    // return
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
        this.setData({
          isLogin: true,
          userInfo: data,
          _openid
        })

        // this._isLogin()
      }
    })
  },
})