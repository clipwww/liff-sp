import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

import '@/plugins/vue-analytics';
import '@/plugins/vant';
import '@/plugins/register-components';
import '@/plugins/vue-filter';
import '@/plugins/vue-meta';
import '@/router/guards';
import { installLIFF } from '@/plugins/liff';

import '@/assets/scss/index.scss';

Vue.config.productionTip = false;

(async () => {
  await installLIFF();

  Vue.config.productionTip = false;

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
})();
