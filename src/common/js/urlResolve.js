/**
 * 解析url参数，转换为对象的形式 App.vue
 * @example ?id=123&name=huang
 * @return Object {id: 123, name: huang}
 */

// 方法一：
export function urlResolve() {
  let urlStr = window.location.search
  let obj = {} // 定义空对象来装处理好的url查询参数
  let result // 正则匹配到的结果数组
  let reg = new RegExp('[?&][^?&]+=[^?&]+', 'g')
  // 循环遍历匹配到的结果集
  while ((result = reg.exec(urlStr)) !== null) {
    // console.log(result[0])
    let tempArr = result[0].slice(1).split('=')
    let key = decodeURIComponent(tempArr[0])
    let value = decodeURIComponent(tempArr[1])
    obj[key] = value
  }
  return obj
}

// 方法二:
export function urlParse() {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  // console.log(arr)
  if (arr) {
    // 遍历得到的是 ['?id=123', '&name=huang']
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
