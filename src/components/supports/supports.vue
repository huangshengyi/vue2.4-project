<template>
  <div id="supports" v-if="this.seller.supports && this.seller.supports.length!==0">
    <ul>
      <li class="supprots-item" v-for="(item,index) in supports" :key="index" :style="liStyle">
        <span class="icon" :class="selecticon[index]" :style="marginRight"></span>
        <span class="text" :style="fontSize" v-if="showText">{{item.description}}</span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      seller: {
        type: Object
      },
      size: {
        type: Number,
        default: 1 // 默认选择几号的图片
      },
      selectType: {
        type: Number,
        default: -1 // -1时，默认显示所有的活动信息
      },
      marginRight: {
        type: Object,
        default() { // 默认右边距是多少
          return {marginRight: '6px'}
        }
      },
      fontSize: {
        type: Object,
        default() { // 字体默认样式
          return {lineHeight: '16px', fontSize: '12px'}
        }
      },
      liStyle: {
        type: Object,
        default() {
          return {} // 这里可以设置li标签的样式 {marginBottom: '12px'}
        }
      },
      showText: {
        type: Boolean,
        default: true // 默认显示图标后的文字描述
      }
    },
    data() {
      return {
        // 图标类名的前缀
        classMap: ['decrease_', 'discount_', 'special_', 'invoice_', 'guarantee_']
      }
    },
    computed: {
      // 组合图标的类名
      selecticon() {
        let arr = []
        for (let i = 0, len = this.classMap.length; i < len; i++) {
          // 如果selectType的值不等于-1,则显示父组件传来对应的type类型
          if (this.selectType !== -1) {
            arr.push(this.classMap[this.selectType] + this.size)
            return arr
          }
          // 否则就显示所有
          arr.push(this.classMap[i] + this.size)
        }
        return arr
      },
      // 过滤信息，判断是否需要全部显示
      supports() {
        let arr = []
        // 只显示传过来对应的type
        if (this.selectType !== -1) {
          arr.push(this.seller.supports[this.selectType])
          return arr
        }
        // 否则直接显示全部
        return this.seller.supports
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"

  #supports
    font-size: 0
    .supprots-item
      margin-bottom: 12px
      &:last-of-type
        margin-bottom: 0
      .text
        display: inline-block
        vertical-align: top
        font-weight: 200
        color: rgb(255, 255, 255)
      .icon
        display: inline-block
        vertical-align: top
        &.decrease_1
          width: 12px
          height: 12px
          bg-image('decrease_1')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.discount_1
          width: 12px
          height: 12px
          bg-image('discount_1')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.special_1
          width: 12px
          height: 12px
          bg-image('special_1')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.invoice_1
          width: 12px
          height: 12px
          bg-image('invoice_1')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.guarantee_1
          width: 12px
          height: 12px
          bg-image('guarantee_1')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.decrease_2
          width: 16px
          height: 16px
          bg-image('decrease_2')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.discount_2
          width: 16px
          height: 16px
          bg-image('discount_2')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.special_2
          width: 16px
          height: 16px
          bg-image('special_2')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.invoice_2
          width: 16px
          height: 16px
          bg-image('invoice_2')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.guarantee_2
          width: 16px
          height: 16px
          bg-image('guarantee_2')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.decrease_3
          width: 12px
          height: 12px
          bg-image('decrease_3')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.discount_3
          width: 12px
          height: 12px
          bg-image('discount_3')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.special_3
          width: 12px
          height: 12px
          bg-image('special_3')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.invoice_3
          width: 12px
          height: 12px
          bg-image('invoice_3')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.guarantee_3
          width: 12px
          height: 12px
          bg-image('guarantee_3')
          background-size: 12px 12px
          background-repeat: no-repeat
        &.decrease_4
          width: 16px
          height: 16px
          bg-image('decrease_4')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.discount_4
          width: 16px
          height: 16px
          bg-image('discount_4')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.special_4
          width: 16px
          height: 16px
          bg-image('special_4')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.invoice_4
          width: 16px
          height: 16px
          bg-image('invoice_4')
          background-size: 16px 16px
          background-repeat: no-repeat
        &.guarantee_4
          width: 16px
          height: 16px
          bg-image('guarantee_4')
          background-size: 16px 16px
          background-repeat: no-repeat
</style>
