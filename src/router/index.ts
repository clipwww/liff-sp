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
      },
      {
        path: 'list',
        name: 'MovieList',
        component: loadComponents('Movie/List'),
        meta: {
          label: '上映中電影查詢'
        },
      },
      {
        path: ':id',
        name: 'MovieDetails',
        component: loadComponents('Movie/Details'),
        meta: {
          label: '上映中電影查詢'
        },
      },
      {
        path: 'favorite/list',
        name: 'MovieFavoriteList',
        component: loadComponents('Movie/FavoriteList'),
        meta: {
          label: '收藏的電影'
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
