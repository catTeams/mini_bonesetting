let db = wx.cloud.database();
// 封装公共代码的数据增、删、改、查

// 增加数据
const _add = (collectionName,data={}) => {
  console.log(data,5555);
  return db.collection(collectionName).add({data})
};
// 条件查找数据
const _find = (collectionName,where={}) => {
  console.log(collectionName,123);
  return db.collection(collectionName).where(where).get()
}
// 条件id查找数据
const _findId = (collectionName,id) => {
  
  return db.collection(collectionName).doc(id).get()
}
// 根据id更新数据
const _updateId = (collectionName,id,data={}) => {
  return db.collection(collectionName).doc(id).update({data})
}
//根据条件更新数据
const _update = (collectionName,where={},data={}) => {
  return db.collection(collectionName).where(where).update({data})
}
// 删除数据
const _del = (collectionName,where={}) => {
  return db.collection(collectionName).where(where).remove()
};

//分页
const _getPage = ((collectionName,where={},pagesize,skip,key,value) =>{
  return db.collection(collectionName).where(where).limit(pagesize).skip(skip).orderBy(key,value).get()
})

// 只显示几条
const _getLimit = ((collectionName,where={},limit) =>{
  return db.collection(collectionName).where(where).limit(limit).get()
})
// 排序
const _getOrderBy = ((collectionName,where={},key,value) =>{
  return db.collection(collectionName).where(where).orderBy(key,value).get()
})
export default {
  _add,
  _find,
  _findId,
  _update,
  _updateId,
  _getPage,
  _del,
  _getLimit,
  _getOrderBy
}