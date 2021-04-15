// miniprogram/pages/addAndEdit/addAndEdit.js
const Api = require('../../utils/api').default;
import {
  openid
} from '../../utils/config.js'
Page({
  data: {
    menus: [],
    menusId: '',
    menusIndex: 0,
    menusText: '点击选择',
    files:[],  //图片
    form: {
      projectName: '',
      menusId: '',
      projectImgs: '',
      projectInfo: '',
      views: 0,
      addTime: '',
      status: 1,
      order: 0,
      projectLabel: '',
      price: 0,
    }
  },
  // 获取菜单
   onShow(){
    this.getMenus()
  },
  async getMenus(){
    let res = await Api._findClassItem({status:1});
    this.setData({
      menus:res.data
    })
  },
  changText(e){
    let {type} = e.currentTarget.dataset;
    let {value} = e.detail
    this.data.form[type] = value;
    this.setData({
      form: this.data.form
    })
  },
  // 获取图片
  _selectFile(e){
    let {tempFilePaths} = e.detail;
    let files = tempFilePaths.map(item => {
      return {url:item}
    })
   this.setData({
     files:this.data.files.concat(files)
   })
    
  },
  // 删除图品
  _delFile(e){
    // console.log(e);
    this.data.files.splice(e.detail.index,1)
  },
  // 表单发布
  async submit(e) {
    if(!this.data.form.projectName){
      wx.showToast({
        title: '项目名称不能为空',
        icon: 'none'
      })
      return
    }
    if(!this.data.menusId){
      wx.showToast({
        title: '请选择项目分类',
        icon: 'none'
      })
      return
    }
    if(!this.data.form.projectInfo){
      wx.showToast({
        title: '项目描述不能为空',
        icon: 'none'
      })
      return
    }
    let data = this.data.form;
    data.menusId = this.data.menusId
    let curr_time = new Date();
    data.addTime = this.myformatter(curr_time);
    let {_openid} = wx.getStorageSync('userInfo');
    if(_openid == openid){
      // console.log(_openid,openid)
      data.status = 1;
    }else{
      
      data.status = 3;
    }
    if(this.data.files.length > 0){
      let uploaders = await this._doImage(this.data.files);
      data.projectImgs = uploaders.map(item => {
        return item.fileID
      })
    }
    let res = await Api._addProject(data);
    
    if(res._id) {
      wx.showToast({
        title: '发布成功',
        duration:2000
      })
      wx.switchTab({
        url:'../index/index'
      })
    }
    
  },
  // 格式化时间
  myformatter(date){       
    let Y = (date.getFullYear()).toString().padStart(2,'0') 
    let M = ( date.getMonth() + 1 ).toString().padStart(2,'0') 
    let D = (date.getDate()).toString().padStart(2,'0') 
    let h = (date.getHours()).toString().padStart(2,'0') 
    let m = (date.getMinutes()).toString().padStart(2,'0') 
    let s = (date.getSeconds()).toString().padStart(2,'0') 
    let strDate = Y + '-' + M + '-' + D +' ' + h + ':' + m + ':' + s
    
    return strDate;
},
  // 图片上传处理
  async _doImage(files){
    let uploaders = [];
    files.forEach(item => {
      // 切割拿到后缀名
      let fileNames = item.url.split('.');
      let suffixName = fileNames[fileNames.length - 1];
      // 随机名
      let name = Math.random().toString().substring(2) + '.' + suffixName;
      let res = wx.cloud.uploadFile({
        cloudPath:name,
        filePath:item.url
      })
      uploaders.push(res)
    })
    let res = await Promise.all(uploaders);
    return res
    
  },
  // 了解途径
  bindMenusChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      menusIndex: e.detail.value,
      menusId: this.data.menus[e.detail.value]._id,
      menusText: this.data.menus[e.detail.value].typeName
    })
  },
})