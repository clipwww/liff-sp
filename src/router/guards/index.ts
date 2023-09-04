import router from '../index'
import store from '@/store'

router.beforeEach(async (to, from, next) => {
  store.dispatch('updateLoggedIn')
  const isLoggedIn = store.state.isLoggedIn
  if (isLoggedIn) {
    store.dispatch('updateProfile')
  }

  next()
})
