<template>
  <div id="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <Star :size="36" :score="seller.score"></Star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <div class="remark">
          <div class="block">
            <span class="text">起送价</span>
            <span class="price">{{seller.minPrice}}<i class="flag">元</i></span>
          </div>
          <div class="block">
            <span class="text">商家配送</span>
            <span class="price">{{seller.deliveryPrice}}<i class="flag">元</i></span>
          </div>
          <div class="block">
            <span class="text">平均配送时间</span>
            <span class="price">{{seller.deliveryTime}}<i class="flag">分钟</i></span>
          </div>
        </div>
        <div class="favorite" @click="toggleFavorite">
          <i class="icon icon-favorite" :class="{'active': favorite}"></i>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <dividing></dividing>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <p class="text">{{seller.bulletin}}</p>
      </div>
      <div class="supports-wrapper">
        <Supports :seller="seller" :size="4" :fontSize="fontSize" :liStyle="liStyle"></Supports>
      </div>
      <dividing></dividing>
      <div class="seller-scene" v-show="seller.pics && seller.pics.length">
        <h1 class="title">商家实景</h1>
        <div class="scene-wrapper" ref="sceneWrapper">
          <ul class="scene-ul" ref="sceneUl">
            <li class="scene-pic" v-for="(pic, index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <dividing></dividing>
      <div class="sellerInfo">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info, index) in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Star from '@/components/star/star'
  import Dividing from '@/components/dividing/dividing'
  import Supports from '@/components/supports/supports'
  import {saveToLocal, getLocalStorage} from '@/common/js/storage'

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
        fontSize: {lineHeight: '16px', fontSize: '12px', color: 'rgb(7,17,27)'},
        liStyle: {padding: '16px 12px', marginBottom: 0, borderTop: '1px solid rgba(7,17,27,0.1)'},
        favorite: (() => {
          // 获取收藏商家信息
          return getLocalStorage(this.seller.id, 'favorite', false)
        })()
      }
    },
    mounted() {
      // 编译完成时，调用滚动方法
      this.$nextTick(() => {
        this._initScroll()
        this._sceneScroll()
      })
    },
    watch: {
      'seller'() {
        // 监视页面所需的数据，第一次进来时，待数据加载完渲染了DOM再调用滚动better-scroll
        this.$nextTick(() => {
          this._initScroll()
          this._sceneScroll()
        })
      }
    },
    computed: {
      // 收藏商家的text
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏'
      }
    },
    methods: {
      // 收藏商家
      toggleFavorite(event) {
        if (!event._constructed) {
          return
        }
        this.favorite = !this.favorite
        // 将收藏商家的信息存储到本地
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      },
      // seller商家页面上下滚动的方法
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      // 商家区块图片滑动
      _sceneScroll() {
        let picLength = this.seller.pics && this.seller.pics.length
        // 判断有没有图片
        if (picLength) {
          let picWidth = 120 // 每张图片的宽度
          let picMargin = 6 // 图片右边外边距
          // 图片ul盒子的宽度计算
          let width = (picWidth + picMargin) * picLength - picMargin
          this.$refs.sceneUl.style.width = width + 'px'
          this.$nextTick(() => {
            if (!this.sceneScroll) {
              this.sceneScroll = new BScroll(this.$refs.sceneWrapper, {
                scrollX: true,
                // 这个属性的作用是让外层区块可以竖向滚动，内层横向滚动，滚动图片时忽略垂直方向的滚动
                eventPassthrough: 'vertical'
              })
            } else {
              this.sceneScroll.refresh()
            }
          })
        }
      }
    },
    components: {
      Star,
      Dividing,
      Supports
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"
  #seller
    position: absolute
    top: 174px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .overview
      position: relative
      padding: 0 18px
      .title
        padding: 18px 0 8px 0
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .desc
        padding-bottom: 18px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        #star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .text
          isplay: inline-block
          vertical-align: top
          line-height: 18px
          font-size: 10px
          color: rgb(77, 85, 93)
          &:first-of-type
            margin-right: 12px
      .remark
        display: flex
        padding: 18px 0
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-of-type
            border-right: none
          .text
            display: block
            margin-bottom: 4px
            font-size: 10px
            color: rgb(147, 153, 159)
          .price
            display: block
            line-height: 24px
            font-size: 24px
            color: rgb(7, 17, 27)
            .flag
              font-style: normal
              font-size: 10px
      .favorite
        position: absolute
        top: 18px
        right: 18px
        width: 40px
        text-align: center
        .icon
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: rgba(7, 17, 27, 0.1)
          &.active
            color: rgb(240, 20, 20)
        .text
          display: block
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 18px 0
      margin: 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        padding: 0 12px
        line-height: 24px
        text-align: justify
        font-size: 12px
        color: rgb(240, 20, 20)
    .supports-wrapper
      padding: 0 18px
    .seller-scene
      padding: 18px 0 18px 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .scene-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap // 不折行
        .scene-ul
          font-size: 0
          .scene-pic
            display: inline-block
            margin-right: 6px
            &:last-of-type
              margin-right: 0
            & > img
              display: block
    .sellerInfo
      padding: 18px 18px 0 18px
      .title
        padding-bottom: 12px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
        border-1px(rgba(7, 17, 27, 0.1))
      .info-item
        padding: 16px 12px
        line-height: 16px
        font-size: 12px
        color: rgb(7, 17, 27)
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-of-type
          border-none()
</style>
