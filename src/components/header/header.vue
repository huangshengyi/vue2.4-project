<template>
  <div id="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title-box">
          <span class="brand"></span>
          <h1 class="title">{{seller.name}}</h1>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}分钟送达
        </div>
        <supports :seller="seller" :size="1" :selectType="type" :marginRight="{marginRight: '4px'}" :fontSize="{lineHeight: '12px', fontSize: '12px'}"></supports>
      </div>
      <div class="supports-count" @click="showDetail=!showDetail" v-if="this.seller.supports && this.seller.supports.length!==0">
        <span class="text">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail=!showDetail">
      <span class="title-bg"></span>
      <span class="text">{{seller.bulletin}}</span>
      <i class="icon icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div class="detail-wrapper" v-show="showDetail">
      <div class="detail">
        <div class="detail-content">
          <h1 class="title">{{seller.name}}</h1>
          <star :size="48" :score="seller.score"></star>
          <title-line :title="'优惠信息'"></title-line>
          <div class="supports-wrapper">
            <supports :seller="seller" :size="2" :marginRight="{marginRight: '6px'}"></supports>
          </div>
          <title-line :title="'商家公告'"></title-line>
          <p class="bulletin-text">{{seller.bulletin}}</p>
        </div>
        <div class="close" @click="showDetail=!showDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Supports from '@/components/supports/supports'
  import Star from '@/components/star/star'
  import TitleLine from '@/components/bulletinTitleLine/bulletinTitleLine'

  export default {
    props: {
      seller: Object
    },
    data() {
      return {
        showDetail: false
      }
    },
    computed: {
      // 这里就显示第一个icon and text
      type() {
        if (this.seller.supports && this.seller.supports.length !== 0) {
          return 0
        }
      }
    },
    components: {
      Supports,
      Star,
      TitleLine
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl";

  #header
    position: relative
    width: 100%
    overflow: hidden
    background: rgba(7, 17, 27, 0.5)
    .content-wrapper
      display: flex
      position: relative
      padding: 24px 16px 18px 24px
      .avatar
        flex: 0 0 64px
        width: 64px
        margin-right: 16px
        & > img
          display: block
      .content
        flex: 1
        .title-box
          margin: 2px 0 8px
          font-size: 0
          .brand
            display: inline-block
            vertical-algin: top
            width: 30px
            height: 18px
            margin-right: 6px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .title
            display: inline-block
            vertical-align: top
            line-height: 18px
            font-weight: bold
            font-size: 16px
            color: rgb(255, 255, 255)
        .description
          margin-bottom: 10px
          line-height: 12px
          font-weight: 200
          color:rgb(255, 255, 255)
          font-size: 12px
      .supports-count
        position: absolute
        right: 16px
        bottom: 18px
        padding: 0px 8px
        height: 24px
        line-heigth: 24px
        border-radius: 24px
        color: rgb(255, 255, 255)
        background: rgba(0, 0, 0, 0.2)
        font-size: 0
        .text
          display: inline-block
          vertical-align: top
          margin-right: 2px
          height: 24px
          line-height: 26px
          font-size: 10px
        .icon-keyboard_arrow_right
          display: inline-block
          vertical-align: top
          height: 24px
          line-height: 24px
          font-size: 10px
    .bulletin-wrapper
      padding: 0 22px 0 12px
      height: 28px
      word-break: keep-all; /* 不换行 */
      white-space: nowrap;  /* 不换行 */
      overflow: hidden;     /* 内容超出宽度时隐藏超出部分的内容 */
      text-overflow: ellipsis;  /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
      background: rgba(7, 17, 27, 0.2)
      font-size: 0
      position: relative
      .title-bg
        display: inline-block
        vertical-align: top
        width: 22px
        height: 12px
        margin: 8px 4px 0 0
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .text
        vertical-align: top
        line-height: 30px
        color: rgb(255, 255, 255)
        font-size: 10px
      .icon
        position: absolute
        right: 12px
        top: 9px
        font-size: 10px
        color: rgb(255, 255, 255)
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      /*滤镜，可以使img图片产生模糊效果*/
      // filter效果，只能使用在SVG元素上；而filter使用在元素上，会直接影响其后代所有元素
      filter: blur(10px)
    .detail-wrapper
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 50
      overflow: auto
      background: rgba(7, 17, 27, 0.8)
      // 适用场景：为背景添加模糊效果；如果目标元素内包裹着其他内容 则应用filter属性;（不支持安卓，效果不明显）
      backdrop-filter: blur(10px) // 只支持ios端；只作用于当前元素；
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter-active, &.fade-leave
        opacity: 1
      &.fade-enter, &.fade-leave-active
        opacity: 0
      .detail
        position: relative
        min-height: 100%
        .detail-content
          padding-top: 64px
          padding-bottom: 64px
          color: rgb(255, 255, 255)
          .title
            text-align: center
            margin-bottom: 16px
            line-height: 16px
            font-size: 16px
            font-weight: 700
          #star
            text-align: center
          .supports-wrapper
            width: 80%
            margin-left: auto
            margin-right: auto
            padding: 0 12px
            box-sizing: border-box
          .bulletin-text
            width: 80%
            margin-left: auto
            margin-right: auto
            padding: 0 12px
            box-sizing: border-box
            line-height: 24px
            text-align: justify // 文字两端对齐
            text-indent: 2em
            font-size: 12px
            color: rgb(255, 255, 255)
        .close
          position: absolute
          width: 100%
          height: 64px
          bottom: 0
          text-align: center
          .icon-close
            color: rgb(255, 255, 255, 0.5)
            font-size: 32px
</style>
