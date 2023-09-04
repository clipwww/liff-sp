// ref. https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
const modules = import.meta.glob('../views/**/*.vue')
export function loadComponents(path: string, index = false) {
  return modules[`../views/${path}${index ? '/index' : ''}.vue`]
}
