<template>
  <div id="cartcontrol">
    <transition-group name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart()" :key="1"></div>
      <div class="cart-count" v-show="food.count>0" :key="2">{{food.count}}</div>
    </transition-group>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      // 删减购物车中商品的方法
      decreaseCart() {
        this.food.count--
      },
      // 增加购物车中商品的方法
      addCart(event) {
        if (!this.food.count) {
          // vue中给对象新增属性，需调用该方法，创建后才是响应式的，不然vue检测不到被添加的值。
          this.$set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
//        console.log(event.target)
        this.$emit('addCart', event.target)
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  #cartcontrol
    font-size: 0
    color: rgb(0, 160, 220)
    .cart-decrease
      display: inline-block
      vertical-align: top
      padding: 6px
      font-size: 24px
      line-height: 24px
    /* 购物车按钮的动画 */
    .move-enter-active, .move-leave-active
      transition: all 0.3s linear
    .move-enter, .move-leave-to
      transform: translate3d(48px, 0, 0) rotate(180deg)
      opacity: 0
    .move-enter-to, .move-leave
      transform: translate3d(0, 0, 0) rotate(0deg)
      opacity: 1
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      height: 36px
      line-height: 36px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      vertical-align: top
      padding: 6px
      font-size: 24px
      line-height: 24px
</style>
