import type { App } from 'vue'
import AppPanel from '@/components/AppPanel.vue'

export function installComponents(app: App) {
  app.component('van-panel', AppPanel)
}
