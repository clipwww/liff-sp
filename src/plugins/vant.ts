import Vue from 'vue'
import Vant, { Lazyload, Locale, Toast } from 'vant'

// @ts-expect-error
import zhTW from 'vant/lib/locale/lang/zh-TW'

import 'vant/lib/index.less'

Toast.setDefaultOptions({ duration: 3000 })
Locale.use('zh-TW', zhTW)

Vue.use(Vant)

Vue.use(Lazyload)
