import { register } from 'register-service-worker'
import { axiosInstace } from './services/base.svc'

register('./sw.js', {
  ready() {
    console.log(
      'App is being served from cache by a service worker.\n'
      + 'For more details, visit https://goo.gl/AFskqB',
    )
  },
  async registered(swReg) {
    console.log('Service worker has been registered.', swReg)

    const sub = await swReg.pushManager.getSubscription()
    console.log('sub', sub)
    if (sub) {
      return
    }
    const newSub: PushSubscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VUE_APP_WEB_PUSH_PUBLIC_KEY,
    })
    console.log('newSub', newSub)
    if (!newSub) {
      return
    }

    axiosInstace.post('/web-push', newSub)
  },
  cached() {
    console.log('Content has been cached for offline use.')
  },
  updatefound() {
    console.log('New content is downloading.')
  },
  updated() {
    console.log('New content is available; please refresh.')
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error(error) {
    console.error('Error during service worker registration:', error)
  },
})
