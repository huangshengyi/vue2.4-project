<template>
  <div id="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" v-for="(item, index) in goods" :key="index" :class="{'current':index===currentIndex}" @click="selectMenu(index, $event)">
          <span class="text">
            <supports :seller="seller" :size="3" :selectType="item.type" :showText="false" :marginRight="{marginRight: '0px'}" v-show="item.type>-1"></supports>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="(foodList, index) in goods" :key="index">
          <h1 class="title">{{foodList.name}}</h1>
          <ul>
            <li class="food-item border-1px" v-for="(food, index) in foodList.foods" :key="index" @click="selectFood($event, food)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc" v-show="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
              <!-- 购物按钮 -->
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food" @addCart="addCart"></cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- vue2.0以上，向子组件传递的绑定可以直接驼峰写法了或带“-”照样生效：如  :minPrice :delivery-price -->
    <shopcart :selectFoods="selectFoods" :minPrice="seller.minPrice" :delivery-price="seller.deliveryPrice" ref="shopcart"></shopcart>
    <!-- 商品详情页 -->
    <foodDetail ref="foodDetail" @addCart="addCart" :selectedFood="selectedFood"></foodDetail>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {API_SELLER} from '@/apiConfig/apiConfig'
  import Supports from '@/components/supports/supports'
  import Shopcart from '@/components/shopcart/shopcart'
  import Cartcontrol from '@/components/cartcontrol/cartcontrol'
  import FoodDetail from '@/components/foodDetail/foodDetail'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    mounted() {
      this.$http.get(API_SELLER).then((response) => {
        if (response.status === 200) {
          // 请求到的数据
          this.goods = response.data.goods
          this.$nextTick(() => {
            // 调用_initScroll方法实现滚动效果
            this._initScroll()
            // 左边列表与右边的foods联动效果
            this._calculateHeight()
          })
        }
      })
    },
    methods: {
      // 点击左边的导航，右边的food列表同时切换到对应的列表栏
      selectMenu(index, event) {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      _initScroll() {
        // 列表导航滚动
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true // 因为better-scroll默认指向了监听，要在元素上使用click事件需传这个属性
        })
        // 商品列表滚动
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3 // 传这个属性相当于探针，实时监视滚动的位置
        })
        // 通过这个对象去监听scroll事件
        this.foodsScroll.on('scroll', (pos) => {
          // 接收滚动的距离
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      // 计算每个区间的高度
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0, len = foodList.length; i < len; i++) {
          let item = foodList[i]
          // 得到每个li区间的高度
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 处理点击购物按钮派发过来的事件
      addCart(element) {
        this._drop(element)
      },
      // 小球动画
      _drop(element) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(element)
        })
      },
      // 查看选中的商品详情页
      selectFood(event, food) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.foodDetail.show()
      }
    },
    computed: {
      // 右边的商品列表滚动时，左边对应的列表index
      currentIndex() {
        for (let i = 0, len = this.listHeight.length; i < len; i++) {
          let height = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      // 商品加入购物车时
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    components: {
      Supports,
      Shopcart,
      Cartcontrol,
      FoodDetail
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"

  #goods
    display: flex
    position: absolute
    top: 174px
    left: 0
    right: 0
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        padding: 0 12px
        width: 56px
        height: 54px
        line-height: 14px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        .text
          display: table-cell
          vertical-align: middle
          font-size: 12px
          #supports
            display: inline-block
            vertical-align: middle
            font-size: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: rgb(255, 255, 255)
          .text
            font-weight: 600
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
        border-left: 3px solid #d9dde1
      .food-item
        display: flex
        padding: 18px 0
        margin-left: 18px
        margin-right: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          flex: 0 0 57px
          width: 57px
          margin-right: 10px
          &>img
            display: block
            border-radius: 2px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 14px
            font-size: 10px
            color: rgb(147, 153, 159)
          .extra
            margin-top: 8px
            font-size: 0
            &>span
              font-size: 10px
            .count
              margin-right: 12px
          .price
            line-height: 24px
            font-weight: 700
            font-size: 0
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
        .cartcontrol-wrapper
          position: absolute
          right: -6px
          bottom: 18px
</style>
