import { CacheFirst, StrategyHandler } from 'workbox-strategies';

class PresentationCache extends CacheFirst {
    constructor(options) {
        super(options);
        this._request = new Map();
    }

    async _handle(request, handler) {
        let responsePromise = this._request.get(request.url);
        let hasPresentation = await caches.has('presentation');
        if (!hasPresentation) {
            responsePromise = super._handle(request, handler);
            this._request.set(request.url, responsePromise);
            try {
                const response = await responsePromise;
                return response.clone();
            } finally {
                this._request.delete(request.url);
            }
        } else {
            let cacheData = await caches.open('presentation');
            let data = await cacheData.match(request);
            console.log(data);

            responsePromise = super._handle(request, handler);
            this._request.set(request.url, responsePromise);
            try {
                const response = await responsePromise;
                return response.clone();
            } finally {
                this._request.delete(request.url);
            }
        }

    }
}

export default PresentationCache;