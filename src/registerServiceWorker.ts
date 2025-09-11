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

    // Check if web push is configured
    const vapidKey = import.meta.env.VUE_APP_WEB_PUSH_PUBLIC_KEY
    if (!vapidKey || vapidKey === 'your_vapid_public_key_here') {
      console.warn('Web Push not configured. Skipping push notification subscription.')
      return
    }

    try {
      const sub = await swReg.pushManager.getSubscription()
      console.log('Existing subscription:', sub)
      if (sub) {
        return
      }

      const newSub: PushSubscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      })
      console.log('New subscription:', newSub)
      if (!newSub) {
        return
      }

      axiosInstace.post('/web-push', newSub)
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
    }
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
