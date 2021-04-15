import db from './db.js';
import {conllections} from './config.js';
// --------用户登录信息---------
// 用户登录的数据添加
const _addUsers = (data = {})=>{
  console.log(data,'33433');
  return db._add(
    conllections.miniUsers,
    data
  )
}
// 用户登录的数据查找
const _hasUsers = (where={}) => {
  return db._find(
    conllections.miniUsers,
    where
  )
}
// 用户登录的数据修改
const _editUsers = (where={},data = {})=>{
  return db._update(
    conllections.miniUsers,
    where,
    data
  )
}
// --------用户登录信息---------

// --------分类列表信息---------
// 添加分类数据
const _addClassItem = (typeName)=>{
  return db._add(conllections.miniClass,{
    typeName,
    status:1
  })
}
// 查找分类数据
const _findClassItem = (where={}) => {
  console.log(where);
  return db._find(conllections.miniClass,where)
}
//查找分类重复数据
const _findSameClassItem=(typeName)=>{
  return db._find(
    conllections.miniClass,
    {
      status:1,
      typeName
    }
  )
}
// 更新分类数据
const _editClassItem=(id,typeName)=>{
  return db._updateId(
    conllections.miniClass,
    id,
    {
      typeName
    }
  )
}
//删除分类数据
const _delClassItemById = (id) => {
  return db._updateId(
    conllections.miniClass,
    id,
    {status:2}
    )
}
// --------分类列表信息---------

// --------项目信息---------
// 添加
const _addProject = (data={})=>{
  return db._add(conllections.miniProjectList,data)
}
// 项目列表
const _getProjectList = ((where={},pagesize,skip,key,value)=>{
  return db._getPage(
    conllections.miniProjectList,
    where,
    pagesize,
    skip,
    key,
    value
  )
})
//查找单个详情
const _findProjectDetail=(id)=>{
  return db._findId(
    conllections.miniProjectList,
    id
  )
}
// --------项目信息---------

// --------订单列表---------
// 添加
const _addOrders = (data={})=>{
  return db._add(conllections.miniOrders,data)
}
// 查询
const _getOrders = (data={})=>{
  return db._find(conllections.miniOrders,data)
}
// 修改
const _editOrders = (id,data={})=>{
  return db._updateId(conllections.miniOrders,id,data)
}
// --------订单列表---------

export default {
  _addUsers,
  _hasUsers,
  _editUsers,
  _findClassItem,
  _findSameClassItem,
  _addClassItem,
  _editClassItem,
  _delClassItemById,
  _addProject,
  _getProjectList,
  _findProjectDetail,
  _addOrders,
  _getOrders,
  _editOrders
}