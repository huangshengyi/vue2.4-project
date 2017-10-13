/**
 * Created by SHENGYI on 2017/10/7.
 * 项目中所有的请求路径集中配置
 */

let ipath = (process.env.NODE_ENV === 'production') ? '/static' : '/static'

// Development 开发时 和 production 生产时 的API接口
export const API_SELLER = ipath + '/data.json'
