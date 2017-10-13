<template>
  <div id="shopcart">
    <div class="content" @click="toggleCartDetail">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="buy">
        <div class="pay" :class="payCommodity.payClass">{{payCommodity.desc}}</div>
      </div>
    </div>
    <!-- 购买时 下落的小球 -->
    <div class="ball-container">
      <transition name="drop" v-for="(ball, index) in balls" :key="index"
                  @before-enter="beforeEnter"
                  @enter="enter"
                  @after-enter="afterEnter">
        <div class="ball" v-show="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
    <!-- 展开购物车的商品详情页 -->
    <transition-group name="fold">
      <div class="cartDetail-list" v-show="showCartList" :key="1">
        <div class="detailHeader">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="emptyCart">清空</span>
        </div>
        <div class="detailList" ref="cartList">
          <ul>
            <li class="item" v-for="(food, index) in selectFoods">
              <span class="foodName">{{food.name}}</span>
              <span class="price"><i class="symbol">￥</i>{{food.count * food.price}}</span>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"  @addCart="addCart"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="cartListMask" v-show="showCartList" @click="toggleCartDetail" :key="2"></div>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Cartcontrol from '@/components/cartcontrol/cartcontrol'

  export default {
    props: {
      // 已经加入购物车中的商品
      selectFoods: {
        type: Array,
        default() {
          // 如果是数组或对象，default就是一个函数来返回数组或对象
          return []
        }
      },
      // 最小起送价
      minPrice: {
        type: Number,
        default: 0
      },
      // 另需配送费
      deliveryPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [],
        fold: true // 购物车列表状态默认是折叠的
      }
    },
    methods: {
      // 购买、付款
      buy() {
        if (!this.totalCount) {
          return
        }
        window.alert(`付款${this.totalPrice + this.deliveryPrice}元！`)
      },
      // 购物车详情列表处触发小球动画按钮
      addCart(element) {
        this.drop(element)
      },
      // 处理下落小球的状态
      drop(element) {
        for (let i = 0, len = this.balls.length; i < len; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            // 将点击购物车按钮的元素加到小球对象里
            ball.targetEle = element
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            // 调用浏览器接口获取元素的所在位置
            let rect = ball.targetEle.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 32)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0, ${y}px ,0)`
            el.style.transform = `translate3d(0, ${y}px, 0)`
            let innerEle = el.getElementsByClassName('inner-hook')[0]
            innerEle.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            innerEle.style.transform = `translate3d(${x}px, 0, 0)`
          }
        }
      },
      enter(el, done) {
        /* eslint-disable no-unused-vars */
        let refresh = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let innerEle = el.getElementsByClassName('inner-hook')[0]
          innerEle.style.webkitTransform = 'translate3d(0,0,0)'
          innerEle.style.transform = 'translate3d(0,0,0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift()
        if (ball.show) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      // 切换查看购物车里的详情折叠状态
      toggleCartDetail() {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      // 清空购物车
      emptyCart() {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      }
    },
    computed: {
      // 购物车中的折叠的状态
      showCartList() {
        if (!this.totalCount) {
          this.fold = true // 初始化
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.cartList, {
                click: true
              })
            } else {
              // 如果存在，就调用已有的this.scroll对象中的refrersh()进行刷新
              this.scroll.refresh()
            }
          })
        }
        return show
      },
      // 计算购物车中所有商品的总数量
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      // 计算购物车中的所有商品的总价
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += parseFloat(food.count) * parseFloat(food.price)
        })
        return total
      },
      // 判断价格是否达到了起送价(类名class 和 支付描述desc)
      payCommodity() {
        if (this.totalPrice === 0) {
          return {payClass: 'not-enough', desc: `￥${this.minPrice}元起送`}
        } else if (this.totalPrice < this.minPrice) {
          return {payClass: 'not-enough', desc: `还差￥${this.minPrice - this.totalPrice}元起送`}
        } else {
          return {payClass: 'enough', desc: '去结算'}
        }
      }
    },
    components: {
      Cartcontrol
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"
  #shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 38
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            text-align: center
            border-radius: 50%
            background: #2b343d
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: rgb(255, 255, 255)
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: rgb(255, 255, 255)
            background: rgb(240, 20, 20)
            box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          padding-right: 12px
          line-height: 24px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          color: rgba(255, 255, 255, 0.4)
          &.highlight
            color: rgb(255, 255, 255)
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
          font-weight: 700
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 31px
        bottom: 26px
        z-index: 100
        transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.5s linear
    .cartDetail-list
      position: absolute
      left: 0
      bottom: 48px
      width: 100%
      z-index: -1
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter-to, &.fold-leave
        transform: translate3d(0, 0, 0)
      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 100%, 0)
      .detailHeader
        padding: 0 18px
        line-height: 40px
        height: 40px
        background: #f3f5f7
        border-bottom: 2px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          padding: 0 3px
          font-size: 12px
          color: rgb(0, 160, 220)
      .detailList
        max-height: 217px
        padding: 0 18px
        overflow: hidden
        background: rgb(255, 255, 255)
        .item
          padding: 12px 0
          height: 24px
          line-height:24px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          .foodName
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 96px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
            & > .symbol
              font-style normal
              font-size: 10px
              font-weight: 700
          .cartcontrol-wrapper
            position: absolute
            right: 0px
            bottom: 6px
    .cartListMask
      position: fixed
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 100%
      z-index: -2
      backdrop-filter: blur(30px) //iphone手机才有这个模糊的效果
      background: rgba(7, 17, 27, 0.6)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-to
        opacity: 0
      &.fold-enter-to, &.fold-leave
        opacity: 1
</style>
