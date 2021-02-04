import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: "hash",
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
          path: '/user-record',
          name: 'user-record',
          component: require('@/views/page/UseRecords').default
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
  const token = window.localStorage.getItem('token')
  // 如果没有token 则直接跳转到登录页
  if (!token) return next('/login')
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

