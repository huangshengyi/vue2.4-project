<template>
  <div id="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="score-wrapper">
        <div class="score-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="desc">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="score-right">
          <div class="score serviceScore">
            <span class="name">服务态度</span>
            <Star :size="36" :score="seller.serviceScore"></Star>
            <span class="num">{{seller.serviceScore}}</span>
          </div>
          <div class="score foodScore">
            <span class="name">商品评分</span>
            <Star :size="36" :score="seller.foodScore"></Star>
            <span class="num">{{seller.foodScore}}</span>
          </div>
          <div class="deliveryTime">
            <span class="name">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <Dividing></Dividing>
      <RatingSelect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"
                    @rating_type="rating_type" @content_toggle="content_toggle"></RatingSelect>
      <div class="ratings-list">
        <ul>
          <li class="rating-item border-1px" v-show="needShow(item.rateType, item.text)" v-for="(item, index) in ratings" :key="index">
            <div class="avatar">
              <img :src="item.avatar" width="28" height="28">
            </div>
            <div class="star-wrapper">
              <h1 class="name">{{item.username}}</h1>
              <div class="star">
                <Star :size="24" :score="item.score"></Star>
                <span class="delivery" v-show="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
              </div>
            </div>
            <p class="text">{{item.text}}</p>
            <div class="recommend" v-show="item.recommend && item.recommend.length">
              <i class="icon icon-thumb_up"></i>
              <span class="item" v-for="(item, index) in item.recommend" :key="index">{{item}}</span>
            </div>
            <div class="rateTime">{{formatTime(item.rateTime)}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {API_SELLER} from '@/apiConfig/apiConfig'
  import {formatDate} from '@/common/js/formatDate'
  import Star from '@/components/star/star'
  import Dividing from '@/components/dividing/dividing'
  import RatingSelect from '@/components/ratingSelect/ratingSelect'

  const ALL = 2 // 默认选择所有的评论

  export default {
    props: {
      seller: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    mounted() {
      this.$http.get(API_SELLER).then((response) => {
        if (response.status === 200) {
          this.ratings = response.data.ratings
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
      })
    },
    methods: {
      // 调用外部的格式化时间戳函数
      formatTime(time) {
        return formatDate(time, 'yyyy-MM-dd hh:mm')
      },
      // 按照需求显示评论
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
      rating_type(type) { // 查看全部、满意、不满意的评论
        this.selectType = type
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      content_toggle(type) { // 是否查看有评论的内容
        this.onlyContent = type
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    },
    components: {
      Star,
      Dividing,
      RatingSelect
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"

  #ratings
    position: absolute
    top: 174px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .score-wrapper
      padding: 18px 0 18px 0
      display: flex
      .score-left
        flex: 0 0 137px
        width: 137px
        padding-top: 6px
        padding-bottom: 6px
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .desc
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .score-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score
          line-height: 18px
          margin-bottom: 8px
          font-size: 0
          .name
            display: inline-block
            vertical-align: top
            margin-right: 12px
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          #star
            display: inline-block
            vertical-align: top
            margin-right: 12px
          .num
            display: inline-block
            vertical-align: top
            line-height: 18px
            font-size: 12px
            color: rgb(255, 153, 0)
        .deliveryTime
          font-size: 0
          .name
            margin-right: 12px
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .time
            line-height: 18px
            font-size: 12px
            color: rgb(147, 153, 159)
    .ratings-list
      padding: 0 18px
      .rating-item
        position: relative
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .avatar
          display: inline-block
          margin-right: 12px
          width: 28px
          height: 28px
          & > img
            display: block
            border-radius: 50%
        .star-wrapper
          display: inline-block
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star
            margin-bottom: 6px
            font-size: 0
            #star
              display: inline-block
            .delivery
              display: inline-block
              margin-left: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
        .text
          margin-bottom: 8px
          padding-left: 40px
          padding-right: 12px
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
        .recommend
          padding-left: 40px
          padding-right: 12px
          font-size: 0
          .icon
            display: inline-block
            vertical-align: top
            line-height: 16px
            font-size: 12px
            &.icon-thumb_up
              color: rgb(0, 160, 220)
            &.icon-thumb_down
              color: rgb(183, 187, 191)
          .item
            display: inline-block
            vertical-align: top
            margin-left: 8px
            margin-bottom: 8px
            padding: 0 6px
            line-height: 16px
            font-size: 9px
            color: rgb(147, 153, 159)
            border-radius: 2px
            border: 1px solid rgba(7, 17, 27, 0.1)
            background-color: #fff
        .rateTime
          position: absolute
          top: 18px
          right: 18px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
</style>
