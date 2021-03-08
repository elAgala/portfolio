import Vue from 'vue'
import VueRouter from 'vue-router'

const DEFAULT_TITLE = 'Julián Benitez'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "main" */ '../views/Main.vue')
  },
  {
    path: '/resume',
    name: 'Resume',
    meta: {title: 'Julián Benitez | Resume'},
    component: () => import(/* webpackChunkName: "resume" */ '../views/Resume.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition){
    if(savedPosition) return savedPosition
    else if(to.hash){
      return {
        selector: to.hash,
        offset: {x: 0, y: 70},
        behavior: 'smooth'
      }
    }
    return {x: 0, y: 0}
  }
})

router.afterEach((to, from) => {
  Vue.nextTick(() => {
      document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router
