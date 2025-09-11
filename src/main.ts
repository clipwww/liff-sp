import { createApp } from 'vue'
import { createPinia } from 'pinia'
import moment from 'moment'
import 'moment/locale/zh-tw.js'
import 'moment/locale/en-gb.js'

import App from './App.vue'
import router from './router'

import './registerServiceWorker'
import '@/plugins/vue-analytics'
import vantPlugin from '@/plugins/vant'
import '@/plugins/register-components'
import vueFilterPlugin from '@/plugins/vue-filter'
import { head } from '@/plugins/vue-meta'
import '@/router/guards'
import { installLIFF } from '@/plugins/liff'

moment.locale('zh-tw')

async function initApp() {
  await installLIFF()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(head)

  // 使用插件
  vantPlugin(app)
  vueFilterPlugin(app)

  app.mount('#app')
}

initApp()
