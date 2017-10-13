<template>
  <transition name="move">
  <div id="foodDetail" v-show="showDetail" ref="foodDetail">
    <div>
      <div class="image_food">
        <img :src="selectedFood.image">
        <div class="icon" @click="hide"><i class="icon-arrow_lift icon_font"></i></div>
      </div>
      <div class="content">
        <h1 class="title">{{selectedFood.name}}</h1>
        <div class="desc">
          <span class="count">月售{{selectedFood.sellCount}}份</span>
          <span class="rating">好评率{{selectedFood.rating}}%</span>
        </div>
        <div class="price">
          <span class="now"><i class="symbol">￥</i>{{selectedFood.price}}</span>
          <span class="old" v-show="selectedFood.oldPrice">￥{{selectedFood.oldPrice}}</span>
        </div>
        <!-- 加入购物车的按钮控制器 -->
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="selectedFood" @addCart="_dropBall"></cartcontrol>
        </div>
        <transition name="fade">
          <div class="addCart" @click="addFirstFood($event)" v-show="cartShow">加入购物车</div>
        </transition>
      </div>
      <!-- 分割线的组件 -->
      <dividing  v-show="selectedFood.info"></dividing>
      <!-- 商家介绍 -->
      <div class="foodDesc" v-show="selectedFood.info">
        <h1 class="title">商家介绍</h1>
        <p class="text">{{selectedFood.info}}</p>
      </div>
      <!-- 分割线的组件 -->
      <dividing></dividing>
      <!-- 商家评价区块 -->
      <div class="rating-wrapper">
        <div class="ratings-header">
          <h1 class="title">商品评价</h1>
          <!-- 控制切换评论内容的组件 -->
          <ratingSelect :ratings="selectedFood.ratings" :selectType="selectType" :onlyContent="onlyContent"
                        @content_toggle="content_toggle" @rating_type="rating_type"></ratingSelect>
        </div>
        <div class="ratings-content">
          <ul>
            <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating, index) in selectedFood.ratings" class="rating-item border-1px">
              <div class="use">
                <span class="name">{{rating.username}}</span>
                <div class="avatar"><img :src="rating.avatar" width="12" height="12"></div>
              </div>
              <div class="time">{{formatTime(rating.rateTime)}}</div>
              <p class="text">
                <i class="icon" :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></i>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="on-rating" v-show="!selectedFood.ratings || !selectedFood.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {formatDate} from '@/common/js/formatDate.js'
  import Cartcontrol from '@/components/cartcontrol/cartcontrol'
  import Dividing from '@/components/dividing/dividing'
  import RatingSelect from '@/components/ratingSelect/ratingSelect'

  const ALL = 2 // 默认选择所有的评论

  export default {
    props: {
      selectedFood: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        showDetail: false,
        selectType: ALL,
        onlyContent: true,
        ratingDesc: {
          all: '全部',
          satisfaction: '推荐',
          displeasure: '吐槽'
        }
      }
    },
    methods: {
      // 调用外部的格式化时间戳函数
      formatTime(time) {
        return formatDate(time, 'yyyy-MM-dd hh:mm')
      },
      // 根据用户的需求 显示评论内容
      needShow(type, text) {
        // 只看有内容的评价
        if (this.onlyContent && !text) {
          return false
        }
        // 所有的评价
        if (this.selectType === ALL) {
          return true
        } else {
          // 推荐或者吐槽的
          return this.selectType === type
        }
      },
      // 处理子组件派发过来的事件start
      rating_type(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh() // 重新刷新DOM
        })
      },
      content_toggle(type) {
        this.onlyContent = type
        this.$nextTick(() => {
          this.scroll.refresh() // 重新刷新DOM
        })
      },
      // 处理子组件派发过来的事件end
      // 向父组件goods派发事件，执行小球动画
      _dropBall(target) {
        this.$emit('addCart', target)
      },
      // 购物车按钮,加入第一个商品时
      addFirstFood(event) {
        if (!this.selectedFood.count) {
          this.$set(this.selectedFood, 'count', 1)
        } else {
          this.selectedFood.count++
        }
        // 向父组件派发事件，通知它执行小球动画
        this.$emit('addCart', event.target)
      },
      // 显示商品详情页
      show() {
        // 打开商品详情页前先初始化值
        this.selectType = ALL
        this.onlyContent = true
        this.showDetail = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodDetail, {
              click: true
            })
          } else {
            this.scroll.refresh() // 如果已经有this.scroll,则重新刷新
          }
        })
      },
      // 关闭商品详情页
      hide() {
        this.showDetail = false
      }
    },
    computed: {
      // 是否显示购物车按钮
      cartShow() {
        if (!this.selectedFood.count) {
          return true
        } else if (this.selectedFood.count < 1) {
          return true
        } else {
          return false
        }
      }
    },
    components: {
      Dividing,
      Cartcontrol,
      RatingSelect
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"

  #foodDetail
    position: fixed
    top: 0px
    left: 0px
    bottom: 48px
    width: 100%
    z-index: 36
    background: #fff
    /* 解决动画出来后的卡顿现象 */
    backface-visibility: hidden
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter-to, &.move-leave
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .image_food
      position: relative
      width: 100%
      padding-top: 100%
      & > img
        position: absolute
        top: 0px
        left: 0px
        width: 100%
        height: 100%
        display: block
      .icon
        position: absolute
        top: 15px
        left: 10px
        .icon_font
          padding: 6px
          font-size: 18px
          color: rgb(255, 255, 255)
    .content
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        font-weight:700
        color: rgb(7, 17, 27)
      .desc
        margin-bottom: 18px
        line-height: 10px
        color: rgb(147, 153, 159)
        font-size: 0
        .count
          margin-right: 12px
          font-size: 10px
        .rating
          font-size: 10px
      .price
        font-size: 0
        line-height: 24px
        .now
          margin-right: 12px
          font-size: 14px
          color: rgb(240, 20, 20)
          .symbol
            font-style: normal
            font-size: 10px
        .old
          text-decoration: line-through
          color: rgb(147, 153, 159)
          font-size: 10px
      .cartcontrol-wrapper
        position: absolute
        right: 18px
        bottom: 12px
      .addCart
        position: absolute
        right: 18px
        bottom: 18px
        padding: 6px 12px
        line-height: 12px
        border-radius: 12px
        font-size: 10px
        cursor: pointer
        color: rgb(255, 255, 255)
        background: rgb(0, 160, 220)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.5s
        &.fade-enter-to, &.fade-leave
          opacity: 1
        &.fade-enter, &.fade-leave-to
          opacity: 0
    .foodDesc
      padding: 18px
      .title
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
        font-weight: 700
      .text
        margin-top: 6px
        padding: 0 6px
        line-height: 24px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating-wrapper
      .title
        margin: 18px 0 0 18px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
        font-weight: 700
    .ratings-content
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .use
          position: absolute
          top: 16px
          right: 0px
          font-size: 0
          .name
            display: inline-block
            vertical-align: top
            margin-right: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            & > img
              display: block
              border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .icon
            margin-right: 4px
            line-height: 24px
            font-size: 12px
            &.icon-thumb_down
              color: rgb(147, 153, 159)
            &.icon-thumb_up
              color: rgb(0, 160, 220)
      /* 无评论的样式 */
      .on-rating
        padding: 18px
        color: rgb(7, 17, 27)
        font-size: 14px
</style>
