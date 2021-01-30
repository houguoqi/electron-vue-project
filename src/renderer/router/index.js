import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
          component: require('@/views/testpage/UploadImg').default
        }
      ]
    }
  ]
})
