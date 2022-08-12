import { Strategy } from 'workbox-strategies';
import axios from 'axios';
/**
 * fetch
 * cachePut
 * fetchAndCachePut
 * cacheMatch
 * 上面四种Strategy的方法
 */
class PresentationCache extends Strategy {
    async _handle(request, handler) {
        let hasPresentation = await caches.has('presentation');
        /**
         * @README: 这里需要进行判断是否是需要更新的内容，如果需要更新，就重新获取数据，否则从缓存中拿
         * @property {*} fetchDone 就是我们需要进行请求时，使用的内容
         * @property {*} matchDone 缓存在cache中的数据
         */
        let fetchDone, matchDone;
        if (!hasPresentation) {
            fetchDone = await handler.fetchAndCachePut(request);
            return fetchDone;
        } else {
            /*
            *NOTE: 按照平时的处理的话，会将数据进行fetch请求，但是存在于cache中了，所以将相当于从cache中拿出，
            *   但是现在我们需要自己处理一下数据，判断是否更新，如果更新了，就手动清除cache,再发起请求
            */
            // let status = await this.verifyUpdate();
            // if (status) {
            //     let newRequest = await this.getNewPresentation(request.url, request);
            //     fetchDone = await handler.fetchAndCachePut(newRequest);
            //     return fetchDone;
            // } else {
            //     matchDone = await handler.cacheMatch(request);
            //     console.log('matchDone:', matchDone)
            //     return matchDone;
            // }
            matchDone = await handler.cacheMatch(request);
            return matchDone;
        }
    }
    /**
     * @method verifyUpdate 效验是否需要更新presentation数据
     */
    async verifyUpdate() {
        let cacheData = await caches.open('presentation');
        let data = await cacheData.match(request);
        let reader = data.body.getReader();
        let dataReader = await reader.read();
        let stringData = "";
        dataReader.value.forEach(v => {
            stringData += String.fromCharCode(v)
        })
        let responseData = JSON.parse(stringData);
        verifyData = {
            id: responseData.data.id,
            updated_at: responseData.data.updated_at
        }
        let response = await axios.post('', verifyData);
        let verify = response.data;

        return verify.result;
    }
    /**
     * @method getNewPresentation 获取新的request
     */
    async getNewPresentation(url, request) {
        let options = {
            method: request.method,
            header: request.header,
            mode: request.mode,
            cache: "no-store",
            credentials: request.credentials,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy
        }
        let newRequest = new Request(url, options);

        return newRequest;
    }
}

export default PresentationCache;