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
      label: '首頁',
      icon: 'wap-home'
    }
  },
  {
    path: '/movie',
    name: 'Movie',
    component: loadComponents('Movie/Layout'),
    redirect: { name: 'MovieSearchTypeChoice' },
    meta: {
      label: '電影時刻查詢',
      icon: 'video-o'
    },
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
        path: 'details/:id',
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
      },
      {
        path: 'next',
        name: 'MovieNext',
        component: loadComponents('Movie/Next'),
        meta: {
          label: '近期上映'
        },
      }
    ]
  },
  {
    path: '/komica',
    name: 'Komica',
    component: loadComponents('Komica/Layout'),
    redirect: { name: 'KomicaNew' },
    meta: {
      label: '糟糕島',
      image: './images/komica.png'
    },
    children: [
      {
        path: 'new',
        name: 'KomicaNew',
        component: loadComponents('Komica/List'),
        meta: {
          label: '新番捏他'
        }
      },
      {
        path: 'new/:id',
        name: 'KomicaNewDetails',
        component: loadComponents('Komica/Details'),
        meta: {
          label: '新番捏他'
        }
      },
      {
        path: 'live',
        name: 'KomicaLive',
        component: loadComponents('Komica/List'),
        meta: {
          label: '新番實況'
        }
      },
      {
        path: 'live/:id',
        name: 'KomicaLiveDetails',
        component: loadComponents('Komica/Details'),
        meta: {
          label: '新番實況'
        }
      },
      {
        path: 'simple-list',
        name: 'KomicaSimpleList',
        component: loadComponents('Komica/SimpleList'),
        meta: {
          label: '簡易列表'
        }
      },
    ]
  },
  {
    path: '/himawari',
    name: 'Himawari',
    component: loadComponents('Himawari/Layout'),
    redirect: { name: 'HimawariList' },
    meta: {
      label: '向日葵動畫',
      image: './images/himawari.png'
    },
    children: [
      {
        path: 'list',
        name: 'HimawariList',
        component: loadComponents('Himawari/List'),
        meta: {
          label: '向日葵動畫列表'
        }
      },
      {
        path: 'details/:id',
        name: 'HimawariDetails',
        component: loadComponents('Himawari/Details'),
        meta: {
          label: '向日葵動畫'
        }
      }
    ]
  },
  {
    path: '/turnip',
    name: 'Turnip',
    component: loadComponents('Turnip/Layout'),
    redirect: { name: 'TurnipDashboard' },
    meta: {
      label: '大頭菜',
      image: 'https://wyspstore2.s3.amazonaws.com/posts/823851001v3.png'
    },
    children: [
      {
        path: 'dashboard',
        name: 'TurnipDashboard',
        component: loadComponents('Turnip/Dashboard'),
        meta: {
          label: '儀表板'
        }
      },
      {
        path: 'group',
        name: 'TurnipGroup',
        component: loadComponents('Turnip/Group'),
        meta: {
          label: '大頭菜群組'
        }
      },
      {
        path: 'group/:id',
        name: 'TurnipGroupDetails',
        component: loadComponents('Turnip/GroupDetails'),
        meta: {
          label: '大頭菜群組'
        }
      },
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
