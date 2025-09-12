import type { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import router from '@/router'

export function logEvent(eventCategory: string, eventAction: string, eventLabel: string): void {
  try {
    // @ts-expect-error gtag is not defined in window type
    window.gtag?.('event', eventAction, {
      event_category: eventCategory,
      event_label: eventLabel,
    })
  } catch (err) {
    console.error(err)
  }
}

export default (app: ReturnType<typeof createApp>) => {
  if (import.meta.env.DEV) {
    app.use(VueGtag, {
      config: { id: 'UA-93335284-5' },
      router,
    })
  }

  app.config.globalProperties.$g_logEvent = logEvent
}
