// import from ""
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkOnly, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from "workbox-expiration"

setCacheNameDetails({
    prefix: "adsionli-back-manager",
    runtime: 'work',
    suffix: "v1.0.1"
})

//图片cdn地址，属于跨域资源，我们使用CacheFirst缓存策略
registerRoute(/^http:\/\/127\.0\.0\.1:3000\/file\//, new CacheFirst({
    cacheName: "local_image",
    plugins: [
        new ExpirationPlugin({
            maxAgeSeconds: 10 * 24 * 60 * 60,
            purgeOnQuotaError: true,
            maxEntries: 5000
        })
    ],
    fetchOptions: {
        mode: "cors",
        credentials: "omit"
    }
}));
registerRoute(/^https:\/\/adsionli-back.xslease.com\/file\//, new CacheFirst({
    cacheName: "online_image",
    plugins: [
        //NOTE: 配置过期时间
        new ExpirationPlugin({
            maxAgeSeconds: 10 * 24 * 60 * 60,
            purgeOnQuotaError: true
        })
    ],
    fetchOptions: {
        mode: "cors",
        credentials: "omit"
    }
}));

precacheAndRoute(self.__WB_MANIFEST);
// 更新时自动生效
clientsClaim();



// 接口数据使用服务端数据
// registerRoute(/^api/, new NetworkOnly());

