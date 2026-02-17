import { createApp } from 'vue'
import 'moment/locale/zh-tw.js'
import 'moment/locale/en-gb.js'

import App from './App.vue'
import router from './router'
import store from './store'

import './registerServiceWorker'
import '@/plugins/register-components'
import '@/router/guards'
import { installLIFF } from '@/plugins/liff'
import { installVant } from '@/plugins/vant'
import { installAnalytics } from '@/plugins/vue-analytics'
import { installFilters } from '@/plugins/vue-filter'

import '@/assets/scss/index.scss'


(async () => {
  await installLIFF()

  const app = createApp(App)

  installVant(app)
  installAnalytics(app)
  installFilters(app)

  app.use(router)
  app.use(store)

  app.mount('#app')
})()
