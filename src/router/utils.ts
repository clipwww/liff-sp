// ref. https://router.vuejs.org/zh/guide/advanced/lazy-loading.html

export const loadComponents = (path: string, index = false) => () => import(/* webpackChunkName: "page-" */ `../views/${path}${index ? '/index' : ''}.vue`);

