import type { createApp } from 'vue'
import Vant, { Locale } from 'vant'

// 全域引入所有組件樣式
import 'vant/lib/index.css'

import zhTW from 'vant/lib/locale/lang/zh-TW'

Locale.use('zh-TW', zhTW)

export default (app: ReturnType<typeof createApp>) => {
  app.use(Vant)
}
