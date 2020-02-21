// ref. https://router.vuejs.org/zh/guide/advanced/lazy-loading.html

export const loadComponents = (path: string, index = false, isLazy = true) => {
  if (isLazy) {
    return () =>
      import(
        /* webpackChunkName: "page-" */ `../views/${path}${
          index ? '/index' : ''
        }.vue`
      );
  } else {
    return require(`../views/${path}${index ? '/index' : ''}.vue`).default;
  }
};
