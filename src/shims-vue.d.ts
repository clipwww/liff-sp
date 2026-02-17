declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: {
      (options: any): any
      fail: (options: any) => any
      success: (options: any) => any
      loading: (options: any) => any
      clear: () => void
    }
    $g_logEvent: (eventCategory: string, eventAction: string, eventLabel: string) => void
    $filters: Record<string, (...args: any[]) => any>
  }
}