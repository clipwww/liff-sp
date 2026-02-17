import type { DefineComponent, VNode } from 'vue'

import type { Liff } from './view-models/liff.vm'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends DefineComponent {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

  interface Window {
    liff: Liff
    gtag?: (...args: any[]) => void
  }
}
