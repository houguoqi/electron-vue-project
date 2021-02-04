import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import http from '@/axios/http'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

console.log(process.env.VUE_APP_BASE_URL, 'process.env.VUE_APP_BASE_URL')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = http
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
