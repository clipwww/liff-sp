import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { installLIFF } from '@/plugins/liff'
import { installVant } from '@/plugins/vant'
import '@/plugins/dayjs'

import { installAnalytics } from '@/plugins/vue-analytics'
import { installFilters } from '@/plugins/vue-filter'
import { installComponents } from '@/plugins/register-components'
import App from './App.vue'

import router from './router'
// import './registerServiceWorker'
import '@/router/guards'

import '@/assets/scss/index.scss'

;

(async () => {
  await installLIFF()

  const app = createApp(App)
  const pinia = createPinia()

  installVant(app)
  installAnalytics(app)
  installFilters(app)
  installComponents(app)

  app.use(pinia)
  app.use(router)

  app.mount('#app')
})()
