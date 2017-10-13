<template>
  <div id="ratingSelect">
    <div class="rating-type border-1px">
      <span class="block" :class="{'active':selectType===2}"
            @click="ratingType(2)">{{ratingDesc.all}}<i class="count">{{ratings.length}}</i></span>
      <span class="block" :class="{'active':selectType===0}"
            @click="ratingType(0)">{{ratingDesc.satisfaction}}<i class="count">{{satisfaction}}</i></span>
      <span class="block displeasure" :class="{'active':selectType===1}"
            @click="ratingType(1)">{{ratingDesc.displeasure}}<i class="count">{{displeasure}}</i></span>
    </div>
    <div class="content-only" @click="toggleContent">
      <i class="icon icon-check_circle" :class="{'on':onlyContent}"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const ALL = 2 // 所有的评论

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      ratingDesc: { // 描述
        type: Object,
        default() {
          return {
            all: '全部',
            satisfaction: '满意',
            displeasure: '不满意'
          }
        }
      },
      selectType: { // 默认选择所有
        type: Number,
        default: ALL
      },
      onlyContent: { // 是否只看有内容的
        type: Boolean,
        default: false
      }
    },
    computed: {
      // 满意的评价数量
      satisfaction() {
        let count = 0
        this.ratings.forEach((rating) => {
          if (rating.rateType === 0) {
            count++
          }
        })
        return count
      },
      // 不满意的评价数量
      displeasure() {
        return this.ratings.length - this.satisfaction
      }
    },
    methods: {
      // 切换评论的类型: 全部、满意、不满意
      ratingType(type) {
        let selectType = type
        this.$emit('rating_type', selectType)
      },
      // 切换是否只看内容的状态
      toggleContent() {
        let onlyContent = !this.onlyContent
        this.$emit('content_toggle', onlyContent)
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"

  #ratingSelect
    padding: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
    .rating-type
      padding: 18px 0
      font-size: 0
      border-1px(rgba(7, 17, 27, 0.1))
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        font-size: 12px
        border-radius: 2px
        color: rgb(77, 85, 93)
        background: rgba(0, 160, 220, 0.2)
        &.active
          color: rgb(255, 255, 255)
          background: rgb(0, 160, 220)
        & > i
          margin-left: 5px
          font-style: normal
          font-size: 8px
        &.displeasure
          background: rgba(77, 85, 93, 0.2)
          &.active /* 激活的类名 */
            background: rgba(77, 85, 93, 0.8)
    .content-only
      padding: 12px 0
      line-height: 24px
      color: rgb(147, 153, 159)
      font-size: 0
      .icon
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
        &.on
          color: #00c850
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
