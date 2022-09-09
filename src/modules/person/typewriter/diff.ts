import * as DiffMatchPatch from "diff-match-patch";
import axios from 'axios';
type RemovalText = {
    type: number,
    from: number,
    length: number,
    text?: ''
}
type AddText = {
    type: number,
    from: number,
    length: number,
    text: string
}
type NormalText = {
    type: number,
    from: number,
    length: number,
    text?: string
}

enum ShowConfig {
    "MAX_LENGTH" = 50,
    "DELETE_STOP_TIME" = 40,
    "INSERT_STOP_TIME" = 80
}
/**
 * @method calculateDiff 计算差异
 */
const calculateDiff = async () => {
    const inputFile = await axios.get('/data/input.md');
    let input = inputFile.data;
    const outputFile = await axios.get("/data/output.md");
    let output = outputFile.data

    const dmp = new DiffMatchPatch.diff_match_patch();
    const diff = dmp.diff_main(input, output);
    dmp.diff_cleanupSemantic(diff);
    let index = 0;
    let handleData: (AddText | RemovalText | NormalText)[] = [];
    if (diff.length != 0) {
        for (let i = 0; i < diff.length; i++) {
            if (diff[i][0] == 1) {
                handleData.push({
                    type: 1,
                    length: diff[i][1].length,
                    from: index,
                    text: diff[i][1]
                })
            } else if (diff[i][0] == -1) {
                handleData.push({
                    type: 2,
                    from: index + diff[i][1].length,
                    length: diff[i][1].length
                })
            } else {
                handleData.push({
                    type: 0,
                    from: index,
                    length: diff[i][1].length,
                    text: diff[i][1]
                })
            }
            index += diff[i][1].length
        }
    }

    return getTypeData(handleData, input, output);
}
/**
 * @method getTypeData 获取Typeit需要显示的数据
 * @param handleData 
 */
const getTypeData = (handleData: (AddText | RemovalText | NormalText)[], input: string, output: string) => {
    let editList: any[] = [];
    for (let i = 0; i < handleData.length; i++) {
        let from = handleData[i].type == 2 ? handleData[i].from - handleData[i].length : handleData[i].from
        let insertProps = handleData[i].length > ShowConfig.MAX_LENGTH ? { instant: true } : { delay: ShowConfig.INSERT_STOP_TIME };
        let breakData = false;
        let breakLength = 0;
        let typeDataList = handleData[i].type !== 2 ? handleData[i].text : output.slice(from, from + handleData[i].length)

        if (typeDataList?.includes('\n')) {  
            breakData = true
            breakLength = typeDataList?.match(/\n/mg)?.length || 0
        }

        typeDataList?.split('\n').forEach((v, i) => {
            editList.push({
                fn: 'type',
                props: Object.assign({ data: v.replace(/\s/g, '&nbsp;') }, { options: insertProps })
            })
            if (i + 1 > breakLength && breakLength != 0) {
                return;
            }

            if (breakData) {
                editList.push({
                    fn: "break",
                    props: {
                        options: {
                            delay: 150
                        }
                    }
                })
            }

        })
        if (handleData[i].type === 2) {
            let props = handleData[i].length > ShowConfig.MAX_LENGTH ? { instant: true } : { delay: ShowConfig.DELETE_STOP_TIME };
            editList.push({
                fn: "delete",
                props: Object.assign({ data: handleData[i].length }, { options: props })
            })
        }
    }
    return { editList, input, output };
}

export {
    calculateDiff
}