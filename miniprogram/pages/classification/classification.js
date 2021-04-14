// miniprogram/pages/classification/classification.js
const Api = require('../../utils/api').default;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddShow: false,
    isEditShow: false,
    typeList: [], // 分类数据
    typeName: '',
    id: ''
  },
  // 显示添加输入框
  openItem() {
    this.setData({
      isEditShow: false,
      isAddShow: !this.data.isAddShow,
      typeName:"",
      showTypeName: ""
    })
  },
  // 显示修改输入框
  _openEditItem(e) {
    this.setData({
      isAddShow: false,
      isEditShow: true,
      typeName: e.currentTarget.dataset.value,
      showTypeName: e.currentTarget.dataset.value,
      id: e.currentTarget.dataset.id
    })
  },
  // 删除
  _delItem(e) {
    let {id} = e.currentTarget.dataset
    wx.showModal({
      title: '是否删除',
      success: async (res) => {
        if (res.confirm) {
          await Api._delClassItemById(id);
          this.getList()
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  // 添加输入框
  _getAddValue(e) {
    this.setData({
      typeName: e.detail.value
    })
  },
  // 确认添加按钮
  async _addItem() {
    let typeName = this.data.typeName;
    if (!typeName) {
      wx.showToast({
        title: '分类名称不能为空',
        icon: 'none'
      })
      return
    }
    let res = await Api._findSameClassItem(typeName)
    console.log(res);
    if (res.data.length == 1) {
      wx.showToast({
        title: '该分类已存在',
        icon: 'none'
      })
      return;
    }
    res = await Api._addClassItem(typeName)
    if (res._id) {
      wx.showToast({
        title: '添加成功',
      })
    }
    this.hiden()
    this.getList()
  },

  // 修改输入框
  _getEditValue(e) {
    this.setData({
      typeName: e.detail.value
    })
  },

  // 修改按钮
  async _editItem() {
    let {
      id,
      typeName
    } = this.data;
    if (!typeName) {
      wx.showToast({
        title: '分类名称不能为空',
        icon: 'none'
      })
      return
    }
    let res = await Api._findSameClassItem(typeName)
    if (res.data.length == 1) {
      wx.showToast({
        title: '该分类已存在',
        icon: 'none'
      })
      return;
    }
     res = await Api._editClassItem(id, typeName)
    wx.showToast({
      title: '修改成功',
    });
    this.getList();
    this.hiden()
  },
  // 取消
  hiden(){
    this.setData({
      isEditShow: false,
      typeName:"",
      showTypeName:''
    })
  },
  // 渲染数据
  async getList() {
    let res = await Api._findClassItem({status:1});
    console.log(res);
    this.setData({
      typeList: res.data
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

})