import axios from "axios"
import { localImage } from './utils';
import { Page } from '../type';
import { convertTextData } from '../text/text';
import { convertImageData } from '../image/image';
import { setItemTypeIndexList } from './utils';

/**
 * @module 本模块用于获取后端数据
 */
const defaultPresentationName = 'default'
const getDefaultPageData = (): Page => {
    return {
        item: {
            text: [],
            image: [],
            code: [],
            count: 0,
        },
        setting: {
            background: {
                type: '',
                data: '',
                config: null,
                image: {
                    url: '',
                    localUrl: ''
                }
            },
            resolution: {
                x: 900,
                y: 600,
            },
        },
        animate: {
            changePage: {
                duration: 1500,
                type: ''
            },
            item: {
                enter: [],
                leave: []
            }
        },
        isEdit: false
    }
}
const getPresentationData = async function (this: any, name: string = defaultPresentationName) {
    let resData = await axios.get(`/api/setting/presentation/get/presentation?name=${name}`);
    let presentationData = resData.data.data;
    if (presentationData === null) {
        return [];
    }
    let pageData = presentationData.presentation_page_list;
    await generatePageData.call(this, pageData);
}
/**
 * @method generatePageData 根据后端回传数据生成显示page数据
 * @param {any} pageData
 */
const generatePageData = async function (this: any, pageData: any) {
    for (let i = 0; i < pageData.length; i++) {
        let page = pageData[i];
        let resPage: Page = getDefaultPageData();
        if (page.page_config.style.background.type === 'image') {
            page.page_config.style.background.data = await localImage(page.page_config.style.background.image.url);
            page.page_config.style.background.image.localUrl = page.page_config.style.background.data;
        }
        resPage.isEdit = false;
        resPage.page_key = page.page_key;
        resPage.id = page.id;
        resPage.animate = page.page_config.animate;
        resPage.setting = page.page_config.style;
        let itemData = {
            text: new Array(),
            image: new Array(),
            code: new Array(),
            count: page.page_item_list.length
        }
        for (let item of page.presentation_page_items) {
            if (item.type === 'text') {
                itemData.text.push(convertTextData(item));
            } else if (item.type === 'image') {
                let imageData = await convertImageData(item);
                itemData.image.push(imageData);
            }
        }
        resPage.item = itemData;
        this.pageList.set(i + 1, resPage);
    }
    this.currentPageData = this.pageList.get(this.currentPage)
    this.itemTypeIndexList = setItemTypeIndexList(this.currentPageData || null);
    console.log(this.itemTypeIndexList)
    this.switchPageAction();
    this.save = false;
}

export default getPresentationData;