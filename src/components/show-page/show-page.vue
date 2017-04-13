<template>
  <div class="show-page" @click="shareHide($event)">
    <main class="container" id="room">
      <header class="header">
        <div class="header__warp">
          <span @click="back">
            <router-link to="/home-page">☁️云纸条</router-link>
          </span>
          <span class="header__warp--living" v-if="true">房间正在直播中</span>
          <span class="header__warp--stopping" v-if="false">当前房间尚未直播...</span>
          <span class="header__warp--sharing" @click.stop="toggleShare" v-show="this.id==='owner'">
            <img src="./sharing.png">
          </span>
          <transition name="share-show">
            <div class="header__warp--dropdown" v-if="shareShow">
              <div class="dropdown--cover">
                <div class="dropdown--container">
                  <p class="dropdown--inviate">快邀请小伙伴加入房间吧！</p>
                  <p class="dropdown--token">
                    <input type="text" :value="token" id="key">
                  </p>
                  <button class="dropdown--copy" type="button" id="copy" data-clipboard-target="#key">{{tips}}</button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </header>
      <section class="paint" id="paint">
        <div class="paint-board">
          <section>
            <div id="write" class="write" v-if="this.id==='owner'">
            </div>
            <div id="read" class="read" v-if="this.id==='host'">
            </div>
          </section>
        </div>
        <aside class="paint__tool" v-if="this.id==='owner'">
          <ul>
            <li><img src="./pencil.png"></li>
            <li><img src="./eraser.png"></li>
          </ul>
        </aside>
      </section>
    </main>
  </div>
</template>
<script type="text/ecmascript-6">
  import Clipboard from 'clipboard'
  import { Position } from '@/common/js/libs'
  import PaperWritter from '@/common/js/paper_writter'
  import PaperReader from '@/common/js/paper_reader'
  import { mapState } from 'vuex'
  import axios from 'axios'
  export default {
    name: 'show-page',
    data () {
      return {
        shareShow: false,
        tips: '点击复制令牌号',
        sendMessage: [],
        getMessage: [],
        socket: '',
        reader: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.copyBoard();
        // 等待vuex数据更新
        let time = setInterval(() => {
          if (this.id !== '') {
            clearInterval(time);
            this.justify();
          }
        }, 200)
      })
    },
    watch: {
      // owner的画板数据改变实时传输
      sendMessage (newValue) {
        this.socket.emit('message', JSON.stringify(newValue));
      },
      // host的画板数据实时接收
      getMessage (newValue) {
        this.reader.message = newValue;
        this.reader.draw();
      }
    },
    computed: {
      ...mapState({
        id: (state) => state.id,
        token: (state) => state.token
      })
    },
    methods: {
      // 返回主页销毁房间
      back () {
        if (confirm('确定退出房间？')) {
          let url = 'http://10.19.220.110:4000/token/destroy/' + this.token;
          axios.get(url).then((res, req) => {
            res = res.data;
            console.log('房间已销毁');
          })
        }
      },
      // 分享按钮打开与关闭
      toggleShare () {
        this.shareShow = !this.shareShow;
        setTimeout(() => {
          this.tips = '点击复制令牌号';
        }, 500);
      },
      // 分享界面关闭，监听空白区域
      shareHide (event) {
        if (!this.shareShow) {
          return
        }
        console.log(event.target.className)
        if (event.target.className === 'container' || event.target.parentNode.className === 'write') {
          this.shareShow = false;
          setTimeout(() => {
            this.tips = '点击复制令牌号';
          }, 500)
        }
      },
      // 挂载复制粘贴
      copyBoard () {
        let copy = new Clipboard('#copy');
        copy.on('success', () => {
          this.tips = '复制成功，快去分享吧'
        })
      },
      // 判断房主还是宾客
      justify () {
        let url = 'http://10.19.220.110:4000/' + this.token;
        let socket = io.connect(url);
        this.socket = socket;
        let height = document.getElementById('paint').offsetHeight - 27;
        if (this.id === 'owner') {
//          let url = 'http://localhost:4000/' + this.token;
          let writter = new PaperWritter({
            'el': document.getElementById('write'),
            'height': 670,
            'width': 1024,
            'url': 'server',
            'message': this.sendMessage
          });
        } else if (this.id === 'host') {
          let that = this;
          this.reader = new PaperReader({
            'el': document.getElementById('read'),
            'height': 670,
            'width': 1024,
            'url': 'server',
            'message': this.getMessage
          });
          socket.on('message', function (data) {
            that.getMessage = JSON.parse(data);
          })
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .show-page
  // 房间页样式文件
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
      padding 0
    a, input
      color: #fff
    #room
      &.container
        overflow: hidden
        position: relative
        background: #fff
      .header
        width: 100vw
        background: #d4af7a
        height: 70px
      .header__warp
        max-width: 1024px
        margin: 0 auto
        height: 100%
        position: relative
        span
          line-height: 70px
        & > span
          padding: 0 20px
          font-size: 1.5em
          color: #FAF7F1
      span
        &.header__warp--living
          font-size: .8em
          &::before
            content: ''
            position: relative
            background: green
            width: 10px
            height: 10px
            border-radius: 50%
            display: inline-block
            margin-right: 10px
        &.header__warp--stopping
          font-size: .8em
          &::before
            content: ''
            position: relative
            background: red
            width: 10px
            height: 10px
            border-radius: 50%
            display: inline-block
            margin-right: 10px
        &.header__warp--sharing
          float: right
          height: 40px
          width: 40px
          padding: 0
          border-radius: 50%
          position: absolute
          right: 0
          top: 50%
          transform: translate3d(0, -50%, 0)
          border: 2px solid #FAF7F1
          margin-right: 20px
          box-sizing border-box
          &:hover
            cursor: pointer
            background: rgba(204, 204, 204, 0.4)
            border-color: rgba(255, 255, 255, 1)
          img
            width: 60%
            height: 60%
            position: absolute
            top: 50%
            left: 50%
            transform: translate3d(-55%, -55%, 0)
      div
        .header__warp--dropdown
          transition: all .2s ease-in
          position: absolute
          z-index: 2
          background: white
          border-radius: 5px 5px 5px 5px
          right: 15px
          height: 200px
          width: 400px
          transform-origin 400px 0
          animation show .5s /**
          说明：
            未知原因，入场动画使用vue渲染会卡顿
          解决办法：
            入场动画使用animation
           */
          @keyframes show
            0%
              transform scale(0)
            100%
              transform scale(1)
          &.share-show-leave-active
            transition transform .5s ease-in-out
          &.share-show-leave-active
            transform scale(0)
          .dropdown--cover
            width: 100%
            height: 100%
            border-radius: 5px 5px 5px 5px
            background: rgba(231, 210, 180, 0.5)
          &::before
            position: absolute
            right: 10px
            transform: translate3d(0, -100%, 0)
            content: ''
            border: 15px solid rgba(231, 210, 180, 0.5)
            border-color: transparent transparent rgba(231, 210, 180, 0.5) transparent
      .dropdown--container
        text-align: center
        position: absolute
        width: 400PX
        top: 50%
        left: 50%
        transform: translate3d(-50%, -50%, 0)
        color: #C72
        .dropdown--token
          border: 2px solid white
          border-radius: 5px
          width: 60%
          margin: 19px auto
          line-height: 1.5em
          background: rgba(204, 204, 204, .5)
          color: white
          box-shadow: 0 0 5px #ccc
          box-sizing border-box
          font-weight bold
          #key
            width 100%
            text-align center
        .dropdown--copy
          box-shadow: 0 0 5px white
          background: #d4af7a
          width: 50%
          box-sizing border-box
      .paint
        width: 1024px
        height 100%
        margin 0 auto
        display: block
        position relative
        z-index: 1
        box-shadow: 0 0 10px rgba(204, 204, 204, 0.5)
        .paint-board
          .read, .write
            display inline-block
            vertical-align top
          .read
            canvas
              margin-top 27px
        .paint__tool
          width: 50px
          background: white
          position: absolute
          right: 20px
          top: 20px
          -webkit-box-shadow: 0 0 15px #ccc
          box-shadow: 0 0 15px #ccc
          opacity: .87
          border-radius: 10px
          ul
            list-style: none
          li
            &:first-child
              border-bottom: 1px solid rgba(204, 204, 204, 0.8)
            &:hover
              cursor: pointer
              background: rgba(204, 204, 204, 0.2)
              img
                animation-duration: 800ms
                animation-name: jump
                animation-timing-function: ease-in-out
                animation-delay: 0
                animation-iteration-count: infinite
            width: 50px
            height: 50px
            img
              width: 30px
              height: 30px
              margin: 10px
              position: relative
              top: 0px;
    @keyframes jump
      33%
        top: 0px
      66%
        top: -8px
      100%
        top: 0px

</style>
