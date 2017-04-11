<template>
  <div class="show-page">
    <main class="container" id="room">
      <header class="header">
        <div class="header__warp">
          <span>
            <router-link to="/home-page">☁️云纸条</router-link>
          </span>
          <span class="header__warp--living">房间正在直播中...</span>
          <span class="header__warp--stopping">当前房间尚未直播...</span>
          <span class="header__warp--sharing toggle"><img src="./sharing.png"></span>
          <div class="header__warp--dropdown">
            <div class="dropdown--cover">
              <div class="dropdown--container">
                <p class="dropdown--inviate">快邀请小伙伴加入房间吧！</p>
                <p class="dropdown--token">XHDJFKHYEDKSDHF</p>
                <button class="dropdown--copy" type="button">点击复制令牌号</button>
              </div>
            </div>

          </div>
        </div>
      </header>
      <section class="paint">
        <canvas id=""></canvas>
        <aside class="paint__tool">
          <ul>
            <li><img src="./pencil.png"></li>
            <li><img src="./eraser.png" alt=""></li>
          </ul>
        </aside>
      </section>
    </main>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'show-page',
    data () {
      return {}
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .show-page
  // 房间页样式文件
    a
      color: #fff
    #room
      &.container
        overflow: hidden
        position: relative
        width: 100vw
        height: 100vh
        margin: 0 auto
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
          display: none
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
        &.header__warp--dropdown
          transition: all .2s ease-in
          position: absolute
          z-index: 2
          background: white
          border-radius: 5px 5px 5px 5px
          right: 15px
          height: 200px
          width: 400px
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
      .header__warp--sharing.toggle + .header__warp--dropdown
        display: none
        box-sizing border-box
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
        .dropdown--copy
          box-shadow: 0 0 5px white
          background: #d4af7a
          width: 50%

      // canvas区域
      .paint
        overflow: hidden
        width: 1024px
        // background: rgba(204,204,204,.5)
        height: 100%
        position: absolute
        top: 70px
        left: 50%
        display: block
        transform: translate3d(-50%, 0, 0)
        z-index: 1
        box-shadow: 0 0 10px rgba(204, 204, 204, 0.5)
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
