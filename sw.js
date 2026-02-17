/* global self */

// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.

// It is read and returned by a dev server middleware that is only loaded
// during development.

// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.

self.addEventListener('push', (event) => {
  if (!event.data) { return }

  const options = event.data.json()
  const title = options.title
  event.waitUntil(
    self.registration.showNotification(title, options),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const notification = event.notification
  const action = event.action
  console.log(notification, action)
  if (!notification.data) { return }
  event.waitUntil(
    clients.openWindow(notification.data.url),
  )
})
