import router from '../index'
import { useMainStore } from '@/store'

router.beforeEach(async (_to, _from, next) => {
  const mainStore = useMainStore()
  mainStore.updateLoggedIn()
  const isLoggedIn = mainStore.isLoggedIn
  if (isLoggedIn) {
    mainStore.updateProfile()
  }

  next()
})
