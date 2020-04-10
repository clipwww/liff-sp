import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import router from '@/router';

Vue.use(VueAnalytics, {
  id: 'UA-93335284-5',
  router,
  autoTracking: {
    exception: true,
    exceptionLogs: false
  }
});

export function logEvent(eventCategory: string, eventAction: string, eventLabel: string): void {
  try {

    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // @ts-ignore
    (Vue.$ga as VueAnalytics).event(eventCategory, eventAction, eventLabel);
  } catch (err) {
    console.error(err);
  }
}


Vue.mixin({
  methods: {
    $g_logEvent: logEvent,
  },
});
