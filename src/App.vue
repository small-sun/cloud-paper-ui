<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import homePage from '@/components/home-page/home-page'
  export default {
    name: 'app',
    components: {
      'home-page': homePage
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
    cursor default
</style>
