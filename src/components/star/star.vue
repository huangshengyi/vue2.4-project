<template>
    <ul id="star">
      <li class="star-item" v-for="(item, index) in starArr" :class="[starType, item]" :key="index"></li>
    </ul>
</template>

<script type="text/ecmascript-6">
  const STARLENGTH = 5 // 星星的个数
  const HALF = 'half' // 半边的星星
  const OFF = 'off' // 灰色的星星
  const ON = 'on' // 完整的星星

  export default {
    props: {
      size: {
        type: Number // 星星的大小
      },
      score: {
        type: Number // 评论分数
      }
    },
    data() {
      return {
        starLength: STARLENGTH
      }
    },
    computed: {
      // 星星的类型
      starType() {
        return 'star' + this.size
      },
      starArr() {
        let arr = []
        let score = parseInt(this.score * 2) / 2
        let hasDecimal = score % 1 !== 0 // 是否有半边的星星
        let integer = Math.floor(score) // 完整的星星个数
        integer = integer > STARLENGTH ? STARLENGTH : integer // 限制完整的星星的数量
        // 取星星的整数部分
        for (let i = 0; i < integer; i++) {
          arr.push(ON)
        }
        // 判断是否存在半边的星星
        if ((integer < STARLENGTH) && hasDecimal) {
          arr.push(HALF)
        }
        // 如果星星数量不够，就直接push灰色的到数组中
        while (arr.length < STARLENGTH) {
          arr.push(OFF)
        }
        return arr
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"

  #star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    .star24
      width: 10px
      height: 10px
      margin-right: 3px
      background-size: 10px 10px
      &:last-of-type
        margin-right: 0
      &.half
        bg-image('star24_half')
      &.off
        bg-image('star24_off')
      &.on
        bg-image('star24_on')
    .star36
      width: 15px
      height: 15px
      margin-right: 6px
      background-size: 15px 15px
      &:last-of-type
        margin-right: 0
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
      &.on
        bg-image('star36_on')
    .star48
      width: 20px
      height: 20px
      margin-right: 22px
      background-size: 20px 20px
      &:last-of-type
        margin-right: 0
      &.half
        bg-image('star48_half')
      &.off
        bg-image('star48_off')
      &.on
        bg-image('star48_on')
</style>
