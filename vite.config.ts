import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue2'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

function pathResolve(dir) {
  return resolve(__dirname, '.', dir)
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  return {
    base: isDev ? '/' : '/liff-sp/',
    envPrefix: 'VUE_APP_',
    plugins: [
      vue(),
      visualizer({
        // ref.https://github.com/btd/rollup-plugin-visualizer
        filename: './dist/report.html',
        template: 'treemap',
        open: false,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/assets/scss/_variables.scss";
          @import "@/assets/scss/_mixin.scss";
        `,
        },
        less: {
          // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
          // `primary` is global variables fields name
          modifyVars: {
            hack: 'true; @import "../../../src/assets/less/vant.var.less";',
          },
        },
      },
    },
    define: {},
    resolve: {
      alias: [
        { find: '@', replacement: pathResolve('src') },
        { find: '~@', replacement: pathResolve('src') },
        { find: /^~@vant/, replacement: resolve('node_modules/@vant') },
      ],
    },
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log'],
    },
  }
})
