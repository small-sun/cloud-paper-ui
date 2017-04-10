import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/components/homePage/homePage'
import showPage from '@/components/showPage/showPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: homePage
    },
    {
      path: '/homePage',
      component: homePage
    },
    {
      path: '/showPage',
      component: showPage
    }
  ]
})
