<template>
  <div class="show-page" @click="shareHide($event)">
    <main class="container" id="room">
      <header class="header">
        <div class="header__warp">
          <span>
            <router-link to="/home-page">☁️云纸条</router-link>
          </span>
          <span class="header__warp--living">房间正在直播中...</span>
          <span class="header__warp--stopping">当前房间尚未直播...</span>
          <span class="header__warp--sharing" @click.stop="toggleShare">
            <img src="./sharing.png">
          </span>
          <transition name="share-show">
            <div class="header__warp--dropdown" v-show="shareShow">
              <div class="dropdown--cover">
                <div class="dropdown--container">
                  <p class="dropdown--inviate">快邀请小伙伴加入房间吧！</p>
                  <p class="dropdown--token">
                    <input type="text" value="XHDJFKHYEDKSDHF" id="key">
                  </p>
                  <button class="dropdown--copy" type="button" id="copy" data-clipboard-target="#key">{{tips}}</button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </header>
      <section class="paint">
        <img class="pencilCursor" src="./pointPencil.png">
        <img class="eraserCursor" src="./pointEraser.png">
        <canvas id="" @mouseenter.stop="enterCanvas" @mouseleave.stop="leaveCanvas" @mousemove.stop="moveCanvas" class="cursorStyle" width="600px" height="600px"></canvas>
        <div class="paint-board">
          <section>
            <div id="write" class="write">
            </div>
            <div id="read" class="read">
            </div>
          </section>
        </div>
        <aside class="paint__tool">
          <ul>
            <li @click.stop="togglePencil"><img src="./pencil.png">
                 <div class="slider__range--container pencil" v-show="pencilShow">
                            <input class="slider__vertical" type="range" min="0" max="100" />
                            <!-- <div class="colorpicker"></div> -->
                            <!-- <color-picker v-model="color"></color-picker> -->
                 </div>
            </li>
            <li @click.stop="toggleEraser"><img src="./eraser.png">
                 <div class="slider__range--container eraser" v-show="eraserShow">
                            <input class="slider__vertical" type="range" min="0" max="100" />
                 </div>
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
  export default {
    name: 'show-page',
    data () {
      return {
        shareShow: false,
        tips: '点击复制令牌号',
        message: [],
        pencilShow: false,
        eraserShow: false,
        paint: true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.copyBoard();
        let writter = new PaperWritter({
          'el': document.getElementById('write'),
          'height': 500,
          'width': 600,
          'url': 'server',
          'message': this.message
        });
        let reader = new PaperReader({
          'el': document.getElementById('read'),
          'height': 500,
          'width': 300,
          'url': 'server',
          'message': this.message
        });
      })
    },
    methods: {
      // 分享按钮打开与关闭
      toggleShare () {
        this.shareShow = !this.shareShow;
        setTimeout(() => {
          this.tips = '点击复制令牌号';
        }, 500)
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
      // 鼠标移入canvas
      enterCanvas (event) {
        let pencilCursor = document.getElementsByClassName('pencilCursor')[0];
        let eraserCursor = document.getElementsByClassName('eraserCursor')[0];
        if (this.paint) {
          let imgValue = document.getElementsByClassName('slider__vertical')[0].value;
          pencilCursor.style.height = imgValue + 'px';
          pencilCursor.style.width = imgValue + 'px';
          pencilCursor.style.display = 'block';
          eraserCursor.style.display = 'none';
        } else {
          let imgValue = document.getElementsByClassName('slider__vertical')[1].value;
          eraserCursor.style.height = imgValue + 'px';
          eraserCursor.style.width = imgValue + 'px';
          pencilCursor.style.display = 'none';
          eraserCursor.style.display = 'block';
        }
        document.getElementsByClassName('cursorStyle')[0].style.cursor = 'none';
      },
      // 鼠标移出canvas
      leaveCanvas () {
        document.getElementsByClassName('cursorStyle')[0].style.cursor = 'default';
      },
      // 鼠标在canvas中移动
      moveCanvas (event) {
        let x = event.pageX;
        let y = event.pageY;
        if (this.paint) {
          document.getElementsByClassName('pencilCursor')[0].style.top = y - 70 + 'px';
          document.getElementsByClassName('pencilCursor')[0].style.left = x + 'px';
        } else {
          document.getElementsByClassName('eraserCursor')[0].style.top = y - 70 + 'px';
          document.getElementsByClassName('eraserCursor')[0].style.left = x + 'px';
        }
      },
      // 分享界面关闭，监听空白区域
      shareHide (event) {
        if (!this.shareShow) {
          return
        }
        if (event.target.className === 'container' || event.target.className === 'paint') {
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
      }
    }
  }
</script>
<style lang="css" rel="stylesheet/css" scoped>
 #room.container {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background: #fff; }
#room .header {
  width: 100vw;
  background: #d4af7a;
  height: 70px; }
#room .header__warp {
  max-width: 1024px;
  margin: 0 auto;
  height: 100%;
  position: relative; }
  #room .header__warp span {
    line-height: 70px; }
  #room .header__warp > span {
    padding: 0 20px;
    font-size: 1.5em;
    color: #FAF7F1; }
#room span.header__warp--living {
  display: none;
  font-size: .8em; }
  #room span.header__warp--living::before {
    content: '';
    position: relative;
    background: green;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px; }
#room span.header__warp--stopping {
  font-size: .8em; }
  #room span.header__warp--stopping::before {
    content: '';
    position: relative;
    background: red;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px; }
#room span.header__warp--sharing {
  float: right;
  height: 40px;
  width: 40px;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  border: 2px solid #FAF7F1;
  margin-right: 20px; }
  #room span.header__warp--sharing:hover {
    cursor: pointer;
    background: rgba(204, 204, 204, 0.4);
    border-color: white; }
  #room span.header__warp--sharing img {
    width: 60%;
    height: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-55%, -55%, 0); }
#room div.header__warp--dropdown {
  transition: all .2s ease-in;
  position: absolute;
  z-index: 2;
  background: white;
  border-radius: 5px 5px 5px 5px;
  right: 15px;
  height: 200px;
  width: 400px; }
  #room div.header__warp--dropdown .dropdown--cover {
    width: 100%;
    height: 100%;
    border-radius: 5px 5px 5px 5px;
    background: rgba(231, 210, 180, 0.5); }
  #room div.header__warp--dropdown::before {
    position: absolute;
    right: 10px;
    transform: translate3d(0, -100%, 0);
    content: '';
    border: 15px solid rgba(231, 210, 180, 0.5);
    border-color: transparent transparent rgba(231, 210, 180, 0.5) transparent; }
#room .header__warp--sharing.toggle + .header__warp--dropdown {
  display: none; }
#room .dropdown--container {
  text-align: center;
  position: absolute;
  width: 400PX;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  color: #C72; }
  #room .dropdown--container .dropdown--token {
    border: 2px solid white;
    border-radius: 5px;
    width: 60%;
    margin: 19px auto;
    line-height: 1.5em;
    background: rgba(204, 204, 204, 0.5);
    color: white;
    box-shadow: 0 0 5px #ccc; }
  #room .dropdown--container .dropdown--copy {
    box-shadow: 0 0 5px white;
    background: #d4af7a;
    width: 50%; }
#room .paint {
  overflow: hidden;
  width: 1024px;
  height: 100%;
  position: absolute;
  top: 70px;
  left: 50%;
  display: block;
  transform: translate3d(-50%, 0, 0);
  z-index: 1;
  box-shadow: 0 0 10px rgba(204, 204, 204, 0.5); }
  #room .paint .pencilCursor {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .cursorStyle {
    cursor: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  #room .paint .eraserCursor {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  #room .paint .paint__tools--cursor {
    transform: translate3d(-50%, -50%, 0);
    display: none;
    position: absolute;
    top: 0;
    left: 0; }
    #room .paint .paint__tools--cursor.pencil {
      display: block;
      width: 20px;
      height: 20px;
      box-shadow: 0 0 10px rgba(204, 204, 204, 0.5);
      background: rgba(200, 200, 200, 0.4);
      border-radius: 50%; }
    #room .paint .paint__tools--cursor.eraser {
      display: block;
      width: 35px;
      height: 35px;
      box-shadow: 0 0 10px rgba(204, 204, 204, 0.5);
      background: rgba(200, 200, 200, 0.4);
      border-radius: 5px 5px 15px 5px;
      transform: translate3d(-50%, -50%, 0) rotate(40deg); }
  #room .paint .paint__tool {
    width: 50px;
    background: white;
    position: absolute;
    right: 20px;
    top: 20px;
    -webkit-box-shadow: 0 0 15px #ccc;
    box-shadow: 0 0 15px #ccc;
    opacity: .87;
    border-radius: 10px; }
    #room .paint .paint__tool ul {
      list-style: none; }
    #room .paint .paint__tool li {
      position: relative;
      width: 50px;
      height: 50px; }
      #room .paint .paint__tool li:first-child {
        border-bottom: 1px solid rgba(204, 204, 204, 0.8); }
      #room .paint .paint__tool li:hover {
        cursor: pointer;
        background: rgba(204, 204, 204, 0.2); }
        #room .paint .paint__tool li:hover img {
          animation-duration: 800ms;
          animation-name: jump;
          animation-timing-function: ease-in-out;
          animation-delay: 0; }
      #room .paint .paint__tool li img {
        width: 30px;
        height: 30px;
        margin: 10px;
        position: relative;
        top: 0px; }
      #room .paint .paint__tool li .slider__range--container {
        position: absolute;
        border-radius: 15px;
        border: 2px solid transparent;
        top: 0px;
        left: -45px;
        height: 231px;
        width: 30px; }
        #room .paint .paint__tool li .slider__range--container .colorpicker {
          position: absolute;
          width: 30px;
          border-radius: 50%;
          height: 30px;
          background: rgba(169, 140, 97, 0.5);
          right: -1px;
          bottom: -7px;
          box-shadow: 0 0 25px #ccc; }
          #room .paint .paint__tool li .slider__range--container .colorpicker.ClassyColor {
            font-size: 4px !important; }
        #room .paint .paint__tool li .slider__range--container.pencil {
          /*display: none;*/ }
        #room .paint .paint__tool li .slider__range--container.eraser {
          /*display: none;*/ }
        #room .paint .paint__tool li .slider__range--container.active {
          display: block; }
        #room .paint .paint__tool li .slider__range--container::after {
          position: absolute;
          z-index: -1;
          right: -18px;
          top: 15px;
          content: '';
          border: 10px solid #d4af7a;
          border-color: transparent transparent transparent #d4af7a; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical {
          border: none;
          position: absolute;
          left: -87px;
          top: 82px;
          transform: rotate(90deg);
          -webkit-appearance: none;
          width: 200px;
          margin: 0px 0;
          padding: 0; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical:focus {
          outline: none; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-webkit-slider-runnable-track {
          width: 100%;
          height: 30px;
          cursor: pointer;
          box-shadow: 0 0 25px #ccc;
          background: #d4af7a;
          border-radius: 15px;
          border: 0px solid rgba(204, 204, 204, 0.23); }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-webkit-slider-thumb {
          box-shadow: 0px 0px 5px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
          border: 1.2px solid rgba(204, 204, 204, 0.57);
          height: 30px;
          width: 30px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: 0px; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical:focus::-webkit-slider-runnable-track {
          background: #d4af7a; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-moz-range-track {
          width: 100%;
          height: 30px;
          cursor: pointer;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          background: #d4af7a;
          border-radius: 15px;
          border: 0px solid rgba(0, 0, 0, 0.23); }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-moz-range-thumb {
          box-shadow: 0px 0px 5px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
          border: 1.2px solid rgba(0, 30, 0, 0.57);
          height: 30px;
          width: 30px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-ms-track {
          width: 100%;
          height: 30px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          color: transparent; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-ms-fill-lower {
          background: #d4af7a;
          border: 0px solid rgba(0, 0, 0, 0.23);
          border-radius: 30px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-ms-fill-upper {
          background: #d4af7a;
          border: 0px solid rgba(0, 0, 0, 0.23);
          border-radius: 30px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical::-ms-thumb {
          box-shadow: 0px 0px 5px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
          border: 1.2px solid rgba(0, 30, 0, 0.57);
          width: 30px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          height: 30px; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical:focus::-ms-fill-lower {
          background: #d4af7a; }
        #room .paint .paint__tool li .slider__range--container input[type=range].slider__vertical:focus::-ms-fill-upper {
          background: #d4af7a; }

@keyframes jump {
  33% {
    top: 0px; }
  66% {
    top: -8px; }
  100% {
    top: 0px; } }

</style>
