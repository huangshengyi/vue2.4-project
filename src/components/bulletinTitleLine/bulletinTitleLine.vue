<template>
  <div id="bulletinTitleLine">
    <div class="line"></div>
    <div class="title">{{title}}</div>
    <div class="line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/css/stylus/mixin.styl"
  #bulletinTitleLine
    display: flex
    width: 80%
    margin: 28px auto 24px
    .title
      padding: 0 12px
      line-height: 14px
      font-weight: 700
      font-size: 14px
      color: #ffffff
    .line
      flex: 1
      height: 0
      margin-top: 6px
      border-bottom: 2px solid rgba(255, 255, 255, 0.2)
</style>
