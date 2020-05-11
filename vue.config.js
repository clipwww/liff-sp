// const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  publicPath: isProd ? '/liff-sp/' : '/',
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
      },
      less: {
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        modifyVars: {
          'hack': `true; @import "../../../src/assets/less/vant.var.less";`
        }
      }
    }
  },
  chainWebpack: config => {
    if (isProd) {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })
    }
  },
  configureWebpack: config => {
    if (isProd) {
      return {
        plugins: [
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ]
      };
    } else {
      return {};
    }
  }
};
