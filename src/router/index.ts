import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'

import { loadComponents } from './utils'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      label: '首頁',
      icon: 'wap-home',
    },
  },
  {
    path: '/movie',
    name: 'Movie',
    component: loadComponents('Movie/Layout'),
    redirect: { name: 'MovieSearchTypeChoice' },
    meta: {
      label: '電影時刻查詢',
      icon: 'video-o',
    },
    children: [
      {
        path: '',
        name: 'MovieSearchTypeChoice',
        component: loadComponents('Movie', true),
        meta: {
          label: '電影時刻查詢',
        },
      },
      {
        path: 'theater',
        name: 'MovieTheaterList',
        component: loadComponents('Movie/Theater'),
        meta: {
          label: '電影院查詢',
        },
      },
      {
        path: 'theater/:id',
        name: 'MovieTheaterDetails',
        component: loadComponents('Movie/TheaterDetails'),
        meta: {
          label: '電影院查詢',
        },
      },
      {
        path: 'list',
        name: 'MovieList',
        component: loadComponents('Movie/List'),
        meta: {
          label: '上映中電影查詢',
        },
      },
      {
        path: 'details/:id',
        name: 'MovieDetails',
        component: loadComponents('Movie/Details'),
        meta: {
          label: '上映中電影查詢',
        },
      },
      {
        path: 'favorite/list',
        name: 'MovieFavoriteList',
        component: loadComponents('Movie/FavoriteList'),
        meta: {
          label: '收藏的電影',
        },
      },
      {
        path: 'next',
        name: 'MovieNext',
        component: loadComponents('Movie/Next'),
        meta: {
          label: '近期上映',
        },
      },
      {
        path: 'vieshow',
        name: 'MovieVieshow',
        component: loadComponents('Movie/Vieshow'),
        meta: {
          label: '威秀時刻表',
        },
      },
    ],
  },
  {
    path: '/komica',
    name: 'Komica',
    component: loadComponents('Komica/Layout'),
    redirect: { name: 'KomicaNew' },
    meta: {
      label: '糟糕島',
      image: './images/komica.png',
    },
    children: [
      {
        path: 'new',
        name: 'KomicaNew',
        component: loadComponents('Komica/List'),
        meta: {
          label: '新番捏他',
        },
      },
      {
        path: 'new/:id',
        name: 'KomicaNewDetails',
        component: loadComponents('Komica/Details'),
        meta: {
          label: '新番捏他',
        },
      },
      {
        path: 'live',
        name: 'KomicaLive',
        component: loadComponents('Komica/List'),
        meta: {
          label: '新番實況',
        },
      },
      {
        path: 'live/:id',
        name: 'KomicaLiveDetails',
        component: loadComponents('Komica/Details'),
        meta: {
          label: '新番實況',
        },
      },
      {
        path: 'simple-list',
        name: 'KomicaSimpleList',
        component: loadComponents('Komica/SimpleList'),
        meta: {
          label: '簡易列表',
        },
      },
    ],
  },

  {
    path: '/turnip',
    name: 'Turnip',
    component: loadComponents('Turnip/Layout'),
    redirect: { name: 'TurnipDashboard' },
    meta: {
      label: '大頭菜',
      image: 'https://wyspstore2.s3.amazonaws.com/posts/823851001v3.png',
    },
    children: [
      {
        path: 'dashboard',
        name: 'TurnipDashboard',
        component: loadComponents('Turnip/Dashboard'),
        meta: {
          label: '儀表板',
        },
      },
      {
        path: 'group',
        name: 'TurnipGroup',
        component: loadComponents('Turnip/Group'),
        meta: {
          label: '群組',
        },
      },
      {
        path: 'group/:id',
        name: 'TurnipGroupDetails',
        component: loadComponents('Turnip/GroupDetails'),
        meta: {
          label: '群組',
        },
      },
      {
        path: 'histories',
        name: 'TurnipHistories',
        component: loadComponents('Turnip/Histories'),
        meta: {
          label: '歷史紀錄',
        },
      },
    ],
  },
  // {
  //   path: '/acnh',
  //   name: 'Acnh',
  //   component: loadComponents('Acnh/Layout'),
  //   redirect: { name: 'AcnhCategory' },
  //   meta: {
  //     label: '狸端機(?) Lite',
  //     image: './images/leaf.png',
  //   },
  //   children: [
  //     {
  //       path: 'category',
  //       name: 'AcnhCategory',
  //       component: loadComponents('Acnh/Category'),
  //       meta: {
  //         label: '分類',
  //       },
  //     },
  //     {
  //       path: 'fish',
  //       name: 'AcnhFish',
  //       component: loadComponents('Acnh/List'),
  //       meta: {
  //         label: '魚',
  //         image: 'http://acnhapi.com/icons/fish/1',
  //       },
  //     },
  //     {
  //       path: 'bugs',
  //       name: 'AcnhBugs',
  //       component: loadComponents('Acnh/List'),
  //       meta: {
  //         label: '蟲',
  //         image: 'http://acnhapi.com/icons/bugs/1',
  //       },
  //     },
  //     {
  //       path: 'fossils',
  //       name: 'AcnhFossils',
  //       component: loadComponents('Acnh/List'),
  //       meta: {
  //         label: '化石',
  //         image: '../images/fossils.png',
  //       },
  //     },
  //     {
  //       path: 'villagers',
  //       name: 'AcnhVillagers',
  //       component: loadComponents('Acnh/List'),
  //       meta: {
  //         label: '小動物',
  //         image: 'http://acnhapi.com/icons/villagers/355',
  //       },
  //     },
  //     {
  //       path: 'art',
  //       name: 'AcnhArt',
  //       component: loadComponents('Acnh/List'),
  //       meta: {
  //         label: '藝術品',
  //         image: 'https://acnhapi.com/v1/images/art/academic_painting',
  //       },
  //     },
  //     {
  //       path: 'songs',
  //       name: 'AcnhSongs',
  //       component: loadComponents('Acnh/List'),
  //       meta: {
  //         label: 'K.K.歌曲',
  //         image: 'http://acnhapi.com/images/songs/1',
  //       },
  //     },
  //   ],
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // console.log('savedPosition', savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

export default router
