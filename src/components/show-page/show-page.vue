<template>
  <div class="show-page" @click="shareHide($event)">
    <main class="container" id="room">
      <header class="header">
        <div class="header__warp">
          <span @click="back">
            <router-link to="/index-page">☁️云纸条</router-link>
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
      <section class="paint" id="paint" @mousemove.stop.prevent="mouseFollow($event)" ref="paint">
        <span class="paint__tools--cursor"
              ref="cursor"
              :class="{pencil:pencilShow,eraser:eraserShow}"
        ></span>
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
            <li @click="adjust($event,'pencil')">
              <img src="./pencil.png">
              <div class="slider__range--container pencil" :class="{active: pencilShow}">
                <input class="slider__vertical" type="range" min="1" max="6" v-model="pencilSize"/>
                <div class="colorpicker"></div>
              </div>
            </li>
            <li @click="adjust($event,'eraser')">
              <img src="./eraser.png">
              <div class="slider__range--container eraser" :class="{active: eraserShow}">
                <input class="slider__vertical" type="range" min="1" max="6" v-model="eraserSize"/>
              </div>
            </li>
            <li @click="adjust($event,'circle')">
              <img src="./circle.png">
              <div class="slider__range--container" :class="{active: circleShow}">
                <input class="slider__vertical" type="range" min="1" max="6" v-model="eraserSize"/>
                <div class="colorpicker"></div>
              </div>
            </li>
            <li @click="adjust($event,'rectangle')">
              <img src="./rectangle.png">
              <div class="slider__range--container" :class="{active: rectangleShow}">
                <input class="slider__vertical" type="range" min="1" max="6" v-model="eraserSize"/>
                <div class="colorpicker"></div>
              </div>
            </li>
            <li>
              <img src="./clean.png">
            </li>
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
        reader: '',
        pencilShow: false,
        eraserShow: false,
        circleShow: false,
        rectangleShow: false,
        paint: true,
        widthDiff: '',
        pencilSize: 5,
        eraserSize: 5
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initCopyBoard();
        // 等待vuex数据更新
        let time = setInterval(() => {
          if (this.id !== '') {
            clearInterval(time);
            this.justify();
            this.initColorBoard();
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
      },
      // 改变笔刷大小
      pencilSize (newValue) {
        this.$refs['cursor'].style.height = `${newValue}px`;
        this.$refs['cursor'].style.width = `${newValue}px`;
      },
      // 改变橡皮大小
      eraserSize (newValue) {
        this.$refs['cursor'].style.height = `${newValue}px`;
        this.$refs['cursor'].style.width = `${newValue}px`;
      }
    },
    computed: {
      ...mapState({
        id: (state) => state.id,
        token: (state) => state.token
      })
    },
    methods: {
      // 初始化画板
      initColorBoard () {
        for (let em of $('.colorpicker')) {
          $(em).ClassyColor({
            color: '#A98C61',
            colorSpace: 'rgba',
            labels: true,
            staticComponents: true,
            displayColor: 'css'
          });
        }
      },
      // 调整画笔和橡皮大小事件
      adjust (event, name) {
        switch (name) {
          case 'pencil':
            this.pencilShow = !this.pencilShow;
            this.eraserShow = false;
            this.circleShow = false;
            this.rectangleShow = false;
            break;
          case 'eraser':
            this.eraserShow = !this.eraserShow;
            this.pencilShow = false;
            this.circleShow = false;
            this.rectangleShow = false;
            break;
          case 'circle':
            this.circleShow = !this.circleShow;
            this.pencilShow = false;
            this.eraserShow = false;
            this.rectangleShow = false;
            break;
          case 'rectangle' :
            this.rectangleShow = !this.rectangleShow;
            this.pencilShow = false;
            this.eraserShow = false;
            this.circleShow = false;
            break;
        }
      },
      // 鼠标跟随移动
      mouseFollow (event) {
        if (!this.widthDiff) {
          this.widthDiff = (window.innerWidth - this.$refs['paint'].offsetWidth) /
            2;
        }
        let topX = event.clientY - 70;
        let leftX = event.clientX - this.widthDiff;
        this.$refs['cursor'].style.top = `${topX}px`;
        this.$refs['cursor'].style.left = `${leftX}px`;
      },
      // 返回主页销毁房间
      back () {
        if (confirm('确定退出房间？')) {
          let url = 'http://localhost:4000/token/destroy/' + this.token;
          // let url = 'http://10.19.220.110:4000/token/destroy/' + this.token;
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
      // 铅笔按钮打开与关闭
      togglePencil () {
        this.paint = true;
        this.pencilShow = !this.pencilShow;
        if (this.eraserShow) {
          this.eraserShow = false;
        }
      },
      // 橡皮按钮打开与关闭
      toggleEraser () {
        this.paint = false;
        this.eraserShow = !this.eraserShow;
        if (this.pencilShow) {
          this.pencilShow = false;
        }
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
      initCopyBoard () {
        let copy = new Clipboard('#copy');
        copy.on('success', () => {
          this.tips = '复制成功，快去分享吧'
        })
      },
      // 判断房主还是宾客
      justify () {
        // let url = 'http://10.19.220.110:4000/';
        let url = 'http://localhost:4000';
        let socket = io.connect(url);
        console.log('connect socket');
        this.socket = socket;
        if (this.id === 'owner') {
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
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #room {
    .paint {
      .paint__tools--cursor {
        transform: translate3d(-50%, -50%, 0);
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        &.pencil {
          display: block;
          width: 20px;
          height: 20px;
          box-shadow: 0 0 10px rgba(204, 204, 204, 0.5);
          background: rgba(200, 200, 200, 0.4);
          border-radius: 50%;
        }
        &.eraser {
          display: block;
          width: 35px;
          height: 35px;
          box-shadow: 0 0 10px rgba(204, 204, 204, 0.5);
          background: rgba(200, 200, 200, 0.4);
          border-radius: 5px 5px 15px 5px;
          transform: translate3d(-50%, -50%, 0) rotate(40deg);
        }
      }
      .paint__tool {
        width: 50px;
        background: white;
        position: absolute;
        right: 20px;
        top: 20px;
        -webkit-box-shadow: 0 0 15px #ccc;
        box-shadow: 0 0 15px #ccc;
        opacity: .87;
        border-radius: 10px;
        ul {
          list-style: none;
        }
        li {
          position: relative;
          &:not(:last-child) {
            border-bottom: 1px solid rgba(204, 204, 204, 0.8);
          }
          &:hover {
            cursor: pointer;
            background: rgba(204, 204, 204, 0.2);
            img {
              animation-duration: 800ms;
              animation-name: jump;
              animation-timing-function: ease-in-out;
              animation-delay: 0; // animation-iteration-count: infinite;
            }
          }
          width: 50px;
          height: 50px;
          img {
            width: 30px;
            height: 30px;
            margin: 10px;
            position: relative;
            top: 0px;
          }
          .slider__range--container {
            position: absolute;
            border-radius: 15px;
            border: 2px solid transparent;
            top: 0px;
            left: -45px;
            height: 231px;
            width: 30px; // background: #DABA8C;
            display none
            .colorpicker {
              position: absolute;
              width: 30px;
              border-radius: 50%;
              height: 30px;
              background: rgba(169, 140, 97, 0.5);
              right: -1px;
              bottom: -7px;
              box-shadow: 0 0 25px #ccc;
              &.ClassyColor {
                font-size: 4px !important;
              }
            }
            &.active {
              display: block;
            }
            &::after {
              position: absolute;
              z-index: -1;
              right: -18px;
              top: 15px;
              content: '';
              border: 10px solid #d4af7a;
              border-color: transparent transparent transparent #d4af7a;
            }
            input[type=range] {
              position: absolute;
              left: -87px;
              top: 82px;
              transform: rotate(90deg);
              -webkit-appearance: none;
              width: 200px;
            }
            input[type=range]:focus {
              outline: none;
            }
            input[type=range]::-webkit-slider-runnable-track {
              width: 100%;
              height: 30px;
              cursor: pointer;
              box-shadow: 0 0 25px #ccc;
              background: #d4af7a;
              border-radius: 15px;
            }
            input[type=range]::-webkit-slider-thumb {
              box-shadow: 0px 0px 5px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
              border: 1.2px solid rgba(204, 204, 204, 0.57);
              height: 30px;
              width: 30px;
              border-radius: 15px;
              background: rgba(255, 255, 255, 0.5);
              cursor: pointer;
              -webkit-appearance: none;
            }
          }
        }
      }
    }
  }
</style>
