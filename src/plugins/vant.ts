import Vue from 'vue';
import Vant, { Toast, Lazyload, Locale } from 'vant';
// @ts-ignore
import zhTW from 'vant/lib/locale/lang/zh-TW';


import 'vant/lib/index.css';

Toast.setDefaultOptions({ duration: 3000 });
Locale.use('zh-TW', zhTW);

Vue.use(Vant);

Vue.use(Lazyload);

