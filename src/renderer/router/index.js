import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      component: require('@/views/home/Home').default,
      children: [
        {
          path: '/',
          redirect: '/upload-file'
        },
        {
          path: '/upload-file',
          name: 'upload-file',
          component: require('@/views/page/CompressImgage').default
        },
        {
          path: '/mark-down-note',
          name: 'mark-down-note',
          component: require('@/views/page/MarkDownNote').default
        },
        {
          path: '/login',
          name: 'login',
          component: require('@/views/page/Login').default
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const userInfo = window.localStorage.getItem('userInfo')
  // 如果没有userInfo 则直接跳转到登录页
  if (!userInfo) return next('/login')
  next()
})

// 渲染进程接收主进程的传参
const { ipcRenderer } = require('electron');
 
ipcRenderer.on('href', (event, arg) => {
  if (arg !== router.currentRoute.fullPath) {
    router.push({ path: arg });
  }
});

export default router

