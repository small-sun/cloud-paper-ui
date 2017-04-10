<template>
  <div class="home-page">
    <section class="form sign-in">
      <h2 class="title">请输入房间令牌以加入演示</h2>
      <label>
        <span class="name">房间令牌</span>
        <input type="text" class="key">
      </label>
      <button type="button" class="submit">加入房间</button>
    </section>
    <section class="sub-container">
      <v-aside></v-aside>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
  import aside from '@/components/aside/aside'
  export default {
    name: '',
    data () {
      return {}
    },
    components: {
      'v-aside': aside
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  body
    background: #1e3c72
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #2a5298, #1e3c72)
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #2a5298, #1e3c72)
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif
    button, input
      border: none
      outline: none
      background: none
      font-family: 'Open Sans', Helvetica, Arial, sans-serif
    button
      display: block
      margin: 0 auto
      width: 30vw
      height: 36px
      border-radius: 30px
      color: #fff
      font-size: 15px
      font-weight bold
      cursor: pointer
    label
      display: block
      width: 30vw
      margin: 25px auto 0
      text-align: center
      span
        font-size: 12px
        color: #cfcfcf
        text-transform: uppercase
        font-weight bold
    h2
      width: 100%
      font-size: 26px
      text-align: center
      font-weight bold
  /* 首页样式 */
  .home-page
    overflow: hidden
    position: relative
    width: 100vw
    height: 100vh
    margin: 0 auto
    background: #fff
    .form
      position: relative
      width: 70vw
      height: 100%
      -webkit-transition: -webkit-transform 1.2s ease-in-out
      transition: -webkit-transform 1.2s ease-in-out
      transition: transform 1.2s ease-in-out,
        -webkit-transform 1.2s ease-in-out
      padding: 200px 30px 0
      box-sizing border-box
    /* 表单中的标题，文字等样式 */
    .key
      display: block
      width: 100%
      margin-top: 5px
      padding-bottom: 5px
      font-size: 16px
      border-bottom: 1px solid rgba(0, 0, 0, 0.4)
      text-align: center
    .submit
      margin-top: 40px
      margin-bottom: 20px
      background: #d4af7a
  .sub-container
    overflow: hidden
    position: absolute
    left: 70vw
    top: 0
    width: 100vw
    height: 100%
    padding-left: 30vw
    background: #fff
    -webkit-transition: -webkit-transform 1.2s ease-in-out
    transition: -webkit-transform 1.2s ease-in-out
    transition: transform 1.2s ease-in-out, -webkit-transform 1.2s ease-in-out

  /* 点击切换的类 */
  .home-page.switch--signup .sub-container
    -webkit-transform: translate3d(-70vw, 0, 0)
    transform: translate3d(-70vw, 0, 0)

</style>
