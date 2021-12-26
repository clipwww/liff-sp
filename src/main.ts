import Vue from 'vue';
import moment from 'moment';
import 'moment/locale/zh-tw.js';
import 'moment/locale/en-gb.js';

import App from './App.vue';
import router from './router';
import store from './store';

import './registerServiceWorker'
import '@/plugins/vue-analytics';
import '@/plugins/vant';
import '@/plugins/register-components';
import '@/plugins/vue-filter';
import '@/plugins/vue-meta';
import '@/router/guards';
import { installLIFF } from '@/plugins/liff';

import '@/assets/scss/index.scss';

moment.locale('zh-tw');
Vue.config.productionTip = false;

(async () => {
  await installLIFF();

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
})();
