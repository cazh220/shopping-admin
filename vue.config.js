// 控制台输入 vue inspect > output.js 可打印当前webpack配置
const path = require("path")
const theme = require("./src/common/antd-theme")
const MomentLocalesPlugin = require("moment-locales-webpack-plugin") // moment 按需加载的插件
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const CompressionPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = ["js", "css"]
module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    port: 8866,
    open: true, // 启动时自动打开浏览器
    hotOnly: true,
    proxy: {
      "/api": {
        target: `http://localhost:8080`,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  chainWebpack: config => {
    // 配置路径别名
    config.resolve.alias
      .set("@", path.join(__dirname, "src"))
      .set("components", path.join(__dirname, "src/components"))
      .set("views", path.join(__dirname, "src/views"))
      .set("api", path.join(__dirname, "src/api"))
      .set("utils", path.join(__dirname, "src/utils"))
      .set("mixins", path.join(__dirname, "src/mixins"))
      .set("plugins", path.join(__dirname, "src/plugins"))
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // 修改它的选项...
        return options
      })
    config.plugin("html").tap(args => {
      args[0].title = "购物平台管理系统"
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: theme,
          javascriptEnabled: true
        }
      }
    }
  },
  pluginOptions: {},
  // 调整webpack配置
  configureWebpack: config => {

    config.plugins.push[("import", { libraryName: "ant-design-vue", libraryDirectory: "es", style: "css" })] // `style: true` 会加载 less 文件

    // momoent 按需加载
    config.plugins.push(
      new MomentLocalesPlugin({
        localesToKeep: ["en", "zh-cn"]
      })
    )

    if (process.env.NODE_ENV === "development") {
      // console.log(config, "webpack配置")
    } else {
      config.plugins.push(
        new CompressionPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
  }
}
