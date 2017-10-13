/**
 * 封装通用localStorage存储的库(存储API接口),存储到本地 seller.vue
 * @param id {用户id}
 * @param key {键名}
 * @param value {键名对应的值}
 */
export function saveToLocal(id, key, value) {
  // 将需要存储的数据赋值到这个__common__字段下
  let common = window.localStorage.__common__
  // 不存在common对象则 创建一个
  if (!common) {
    common = {}
    common[id] = {}
  } else {
    // localStorage只能存储的是字符串，需要转换为json对象
    common = JSON.parse(common)
    // 判断common中是否存在该id
    if (!common[id]) {
      common[id] = {}
    }
  }
  common[id][key] = value
  // localStorage不能直接存储对象，需将对象转换为字符串后再存储
  window.localStorage.__common__ = JSON.stringify(common)
}

/**
 * 获取本地localStorage存储的数据
 * @param id {用户id}
 * @param key {键名}
 * @param defaultValue {如果没有值就返回这个默认值}
 */
export function getLocalStorage(id, key, defaultValue) {
  let common = window.localStorage.__common__
  if (!common) {
    // 完全没有存储过就返回默认值
    return defaultValue
  }
  // 转换为对象并取出id
  common = JSON.parse(common)[id]
  if (!common) {
    return defaultValue
  }
  let result = common[key]
  return result || defaultValue
}

/**
 * 删除localStorage中的指定数据
 * @param id
 */
export function delLocalStorage(id) {
  let common = window.localStorage.__common__
  // 判断seller是否存在
  if (!common) {
    return
  } else {
    common = JSON.parse(common)
    if (common[id]) {
      // 删除指定的id那条记录
      delete common[id]
      // console.log(common)
      window.localStorage.__common__ = JSON.stringify(common)
    }
  }
}
