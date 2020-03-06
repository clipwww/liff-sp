import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';

import { loadComponents } from './utils';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      label: '首頁'
    }
  },
  {
    path: '/movie',
    name: 'Movie',
    component: loadComponents('Movie/Layout'),
    redirect: { name: 'MovieSearchTypeChoice' },
    children: [
      {
        path: '',
        name: 'MovieSearchTypeChoice',
        component: loadComponents('Movie', true),
        meta: {
          label: '電影時刻查詢'
        },
      },
      {
        path: 'theater',
        name: 'MovieTheaterList',
        component: loadComponents('Movie/Theater'),
        meta: {
          label: '電影院查詢'
        },
      },
      {
        path: 'theater/:id',
        name: 'MovieTheaterDetails',
        component: loadComponents('Movie/TheaterDetails'),
        meta: {
          label: '電影院查詢'
        },
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
