<template>
  <div>
    <aside class="aside">
      <div class="aside__text aside--signup">
        <h2>☁️云纸条</h2>
        <p>快创建房间和小伙伴一起分享纸条吧!</p>
      </div>
      <div class="aside__text aside--signin">
        <h2>☁️云纸条</h2>
        <p>快来加入小伙伴的房间吧!</p>
      </div>
      <div class="aside__btn">
        <span class="aside--signup" @click="create">
          <router-link to="/show-page">创建房间</router-link>
        </span>
        <span class="aside--signin">加入房间</span>
      </div>
    </aside>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import * as type from '@/store/mutation-types'
  export default {
    name: 'aside',
    data () {
      return {}
    },
    methods: {
      create () {
        this.changeId('owner');
//        let url = 'http://localhost:4000/token/create'
        let url = 'http://10.19.220.110:4000/token/create';
        axios.get(url, {withCredentials: true})
          .then((res, req) => {
            res = res.data;
            this.changeToken(res.token);
          })
      },
      changeId (newValue) {
        this.$store.commit(type.CHANGE_ID, newValue);
      },
      changeToken (newValue) {
        this.$store.commit(type.CHANGE_TOKEN, newValue);
      }
    },
    sockets: {
      connect () {
        console.log('success')
      },
      message () {
        console.log('收到返回数据')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  /* 待切换的侧边栏 */
  .aside
    overflow: hidden
    z-index: 2
    position: absolute
    left: 0
    top: 0
    width: 30vw
    height: 100%
    padding-top: 360px
    box-sizing border-box

  .aside:before
    content: ''
    position: absolute
    right: 0
    top: 0
    width: 100vw
    height: 100%
    background-image: url("./bg.jpg")
    background-size: cover
    -webkit-transition: -webkit-transform 1.2s ease-in-out
    transition: -webkit-transform 1.2s ease-in-out
    transition: transform 1.2s ease-in-out
    transition: transform 1.2s ease-in-out, -webkit-transform 1.2s ease-in-out

  .aside:after
    content: ''
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.6)

  .home-page.switch--signup .aside:before
    -webkit-transform: translate3d(70vw, 0, 0)
    transform: translate3d(70vw, 0, 0)

  .aside__text
    z-index: 2
    position: absolute
    left: 0
    top: 200px
    width: 100%
    padding: 0 20px
    text-align: center
    color: #fff
    -webkit-transition: -webkit-transform 1.2s ease-in-out
    transition: -webkit-transform 1.2s ease-in-out
    transition: transform 1.2s ease-in-out
    transition: transform 1.2s ease-in-out, -webkit-transform 1.2s ease-in-out
    box-sizing border-box

  .aside__text h2
    font-size: 2em
    margin-bottom: 10px
    font-weight: normal

  .aside__text p
    font-size: 1em
    line-height: 1.5

  .home-page.switch--signup .aside__text.aside--signup
    -webkit-transform: translateX(520px)
    transform: translateX(520px)

  .aside__text.aside--signin
    -webkit-transform: translateX(-520px)
    transform: translateX(-520px)

  .home-page.switch--signup .aside__text.aside--signin
    -webkit-transform: translateX(0)
    transform: translateX(0)

  .aside__btn
    overflow: hidden
    z-index: 2
    position: relative
    width: 100px
    height: 36px
    margin: 0 auto
    background: transparent
    color: #fff
    text-transform: uppercase
    font-size: 15px
    cursor: pointer

  /* 为按钮加上border样式 */
  .aside__btn:after
    content: ''
    z-index: -1
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    border: 2px solid #fff
    border-radius: 30px
    box-sizing border-box

  .aside__btn span
    position: absolute
    left: 0
    top: 0
    display: -webkit-box
    display: -ms-flexbox
    display: flex
    -webkit-box-pack: center
    -ms-flex-pack: center
    justify-content: center
    -webkit-box-align: center
    -ms-flex-align: center
    align-items: center
    width: 100%
    height: 100%
    -webkit-transition: -webkit-transform 1.2s
    transition: -webkit-transform 1.2s
    transition: transform 1.2s
    transition: transform 1.2s, -webkit-transform 1.2s
    font-weight bold
    a
      display inline-block
      width 100%
      height 100%
      text-align center
      line-height 36px
      color #fff

  .aside__btn span.aside--signin
    -webkit-transform: translateY(-72px)
    transform: translateY(-72px)

  .home-page.switch--signup .aside__btn span.aside--signin
    -webkit-transform: translateY(0)
    transform: translateY(0)

  .home-page.switch--signup .aside__btn span.aside--signup
    -webkit-transform: translateY(72px)
    transform: translateY(72px)

  .sign-in
    -webkit-transition-timing-function: ease-out
    transition-timing-function: ease-out

  .home-page.switch--signup .sign-in
    -webkit-transition-timing-function: ease-in-out
    transition-timing-function: ease-in-out
    -webkit-transition-duration: 1.2s
    transition-duration: 1.2s
    -webkit-transform: translate3d(70vw, 0, 0)
    transform: translate3d(70vw, 0, 0)

  .sign-up
    -webkit-transform: translate3d(-100vw, 0, 0)
    transform: translate3d(-100vw, 0, 0)

  .home-page.switch--signup .sign-up
    -webkit-transform: translate3d(0, 0, 0)
    transform: translate3d(0, 0, 0)
</style>
