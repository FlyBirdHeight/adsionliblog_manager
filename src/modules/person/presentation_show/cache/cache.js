// import from ""
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkOnly, CacheFirst } from 'workbox-strategies';

setCacheNameDetails({
    prefix: "adsionli-back-manager",
    suffix: "v1.0.0"
})

//图片cdn地址，属于跨域资源，我们使用CacheFirst缓存策略
registerRoute(/^127\.0\.0\.1:3000\/file\//, new StaleWhileRevalidate());
// registerRoute(/^10\.12\.44\.122:3000\/file\//, new StaleWhileRevalidate());
// 更新时自动生效
// clientsClaim();

// precacheAndRoute(self.__WB_MANIFEST);

// 接口数据使用服务端数据
// registerRoute(/^api/, new NetworkOnly());

