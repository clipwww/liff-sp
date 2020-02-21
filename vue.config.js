const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/liff-money/' : '/',
  devServer: {
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      // 預先載入的全域共用scss
      scss: {
        prependData: `
          @import "@/assets/scss/_variables.scss";
          @import "@/assets/scss/_mixin.scss";
        `
        // ref. https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            terserOptions: {
              compress: {
                drop_console: true,
                pure_funcs: ['console.log']
              }
            }
          })
        ]
      };
    } else {
      return {};
    }
  }
};
