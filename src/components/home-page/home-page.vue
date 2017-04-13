<template>
  <div class="home-page">
    <section class="form sign-in">
      <h2 class="title">请输入房间令牌以加入演示</h2>
      <label>
        <span class="name">房间令牌</span>
        <input type="text" class="key" v-model="inputToken">
      </label>
      <button type="button" class="submit" @click.prevent="join">
        <router-link :to="url" class="getIn">加入房间</router-link>
      </button>
    </section>
    <section class="sub-container">
      <v-aside></v-aside>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
  import aside from '@/components/aside/aside'
  import axios from 'axios'
  import { mapState } from 'vuex'
  import * as type from '@/store/mutation-types'
  export default {
    name: 'home-page',
    data () {
      return {
        inputToken: '',
        url: ''
      }
    },
    components: {
      'v-aside': aside
    },
    computed: {
      ...mapState({
        id: (state) => state.id,
        token: (status) => state.token
      })
    },
    methods: {
      join () {
        this.changeId('host');
//        let url = 'http://localhost:4000/websocket/connect/' + this.inputToken;
        let url = 'http://10.19.220.110:4000/websocket/connect/' + this.inputToken;
        axios.get(url, {withCredentials: true}).then((res, req) => {
          res = res.data;
          if (res.errmsg === 'ok') {
            this.url = '/show-page';
            this.changeToken(res.token)
          } else {
            console.log('密码不对');
          }
        })
      },
      changeId (newValue) {
        this.$store.commit(type.CHANGE_ID, newValue);
      },
      changeToken (newValue) {
        this.$store.commit(type.CHANGE_TOKEN, newValue);
      }
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
    a
      color: #fff

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
      padding 0
      .getIn
        display inline-block
        width 100%
        height 100%
        line-height 36px

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
