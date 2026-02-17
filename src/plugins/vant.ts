import Vant, {
  closeToast,
  Lazyload,
  Locale,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  showToast,
} from 'vant'

import zhTW from 'vant/es/locale/lang/zh-TW'

import 'vant/lib/index.css'

type ToastOptions = string | { message?: string, [key: string]: any }

function normalizeOptions(options: ToastOptions) {
  if (typeof options === 'string') {
    return { message: options }
  }

  return options
}

const toast = Object.assign(
  (options: ToastOptions) => showToast(normalizeOptions(options)),
  {
    fail(options: ToastOptions) {
      return showFailToast(normalizeOptions(options))
    },
    success(options: ToastOptions) {
      return showSuccessToast(normalizeOptions(options))
    },
    loading(options: ToastOptions) {
      return showLoadingToast(normalizeOptions(options))
    },
    clear() {
      closeToast()
    },
  },
)

export const Toast = toast

Locale.use('zh-TW', zhTW)

export function installVant(app: any) {
  app.use(Vant)
  app.use(Lazyload)
  app.config.globalProperties.$toast = toast
}
