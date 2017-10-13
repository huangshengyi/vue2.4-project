<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="nav">
      <div class="nav-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="nav-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="nav-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {API_SELLER} from '@/apiConfig/apiConfig'
  import {urlResolve} from '@/common/js/urlResolve'
  import vHeader from '@/components/header/header'

  export default {
    name: 'app',
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlResolve()
            return queryParam.id
          })()
        }
      }
    },
    mounted() {
      // 获取数据
      this.$http.get(API_SELLER).then((response) => {
        if (response.status === 200) {
          // 合并多个对象
          this.seller = Object.assign({}, this.seller, response.data.seller)
        }
      })
    },
    components: {
      vHeader
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import 'common/css/stylus/mixin.styl'
  #app
    .nav
      display: flex
      line-height: 40px
      height: 40px
      text-align: center
      border-1px(rgba(7, 17, 27, 0.1))
      .nav-item
        flex: 1
        & > a
          display: block
          width: 100%
          height: 100%
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
