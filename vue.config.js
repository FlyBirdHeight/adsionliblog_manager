const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

// const WorkboxPlugin = require('workbox-webpack-plugin')
// const workbox = new WorkboxPlugin.InjectManifest({
//     swSrc: "./src/modules/person/presentation_show/cache/cache.js",
//     maximumFileSizeToCacheInBytes: 512 * 1024 * 1024,
//     swDest: "sw.js"
// })

module.exports = {
    // 基本路径  3.6之前的版本时 baseUrl
    publicPath: "/",

    // 输出文件目录
    outputDir: "adsionli-admin",

    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // productionSourceMap: /production$/.test(process.env.npm_lifecycle_script) ? false : true,
    productionSourceMap: true,

    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 8854,
        https: false,
        hotOnly: true,
        historyApiFallback: true,
        proxy: {
            // '/api': {
            //     target: 'https://adsionli-back.xslease.com/',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': '/'
            //     }
            // }
            '/api': {
                target: 'http://127.0.0.1:3000/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
    },

    configureWebpack: {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            // workbox
        ]
    },

    css: {
        requireModuleExtension: true,
        loaderOptions: {
            sass: {
                // 全局sass变量	
                //sass-loader 新版本
                data: `
                    @import "./public/scss/index.scss";
                `
            }
        }
    },

    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'adsionli-admin'
        }
    },

    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: []
        }
    }
}
