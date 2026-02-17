export function logEvent(eventCategory: string, eventAction: string, eventLabel: string): void {
  try {
    window.gtag?.('event', eventAction, {
      event_category: eventCategory,
      event_label: eventLabel,
    })
  }
  catch (err) {
    console.error(err)
  }
}

export function installAnalytics(app: any) {
  app.config.globalProperties.$g_logEvent = logEvent
}
