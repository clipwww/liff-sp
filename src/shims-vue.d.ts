declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-gapi' {
  import { PluginFunction } from 'vue'

  // The `install` method is called inside Vue.use() function. It's required.
  export const install: PluginFunction<{}>

  // Add global object to Vue instance, so you can use `this.@login` etc.
  module 'vue/types/vue' {
    interface Vue {
      $logout: any,
      $login: any,
      $getGapiClient: () => Promise<any>,
      $isAuthenticated: any
    }
  }
}