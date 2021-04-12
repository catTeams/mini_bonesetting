import db from './db.js';
import {conllections} from './config.js';
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

export default {
  _addUsers,
  _hasUsers,
  _editUsers
}