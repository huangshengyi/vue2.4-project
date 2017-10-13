/**
 * 格式化时间戳
 * @param date {传来的时间戳}
 * @param fmt {传来的时间格式化后的样板}
 */
export function formatDate(date, fmt) {
  date = new Date(date)
  // 处理年份
  if (/(y+)/g.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))

    let obj = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in obj) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = obj[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      }
    }
  }
  // console.log(fmt)
  return fmt
}
// 定义一个函数来给小于10以下的数字补一个0
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
