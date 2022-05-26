import MatchingPattern from "./utils/matching_pattern"
class Analysis {
    constructor() {
        this.axios = require("axios");
    }

    /**
     * @method setFilePath 读取文件
     * @param {*} filePath 文件路径
     */
    async setFilePath(filePath) {
        try {
            let matchingPattern = new MatchingPattern();
            let requestData = await this.axios.get(filePath);
            requestData = requestData.data;
            let returnData = await matchingPattern.handle(requestData);
            matchingPattern = null;
            return returnData;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}

export default Analysis;