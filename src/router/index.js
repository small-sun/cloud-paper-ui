import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/components/home-page/home-page'
import showPage from '@/components/show-page/show-page'
import indexPage from '@/components/index-page/index-page'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: indexPage
    },
    {
      path: '/home-page',
      component: homePage
    },
    {
      path: '/show-page',
      component: showPage
    }
  ]
})
