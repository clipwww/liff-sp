import { useAppStore } from '@/store'
import router from '../index'

router.beforeEach(async () => {
  const appStore = useAppStore()
  appStore.updateLoggedIn()
  if (appStore.isLoggedIn) {
    appStore.updateProfile()
  }

  return true
})

router.afterEach((to) => {
  const title = to.matched
    .map(item => item.meta?.label as string)
    .filter(Boolean)
    .join(' - ')

  document.title = title ? `${title} | 滅茶苦茶` : '滅茶苦茶'
})
