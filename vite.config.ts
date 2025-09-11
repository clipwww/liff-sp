import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

function pathResolve(dir: string) {
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
    css: {},
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
