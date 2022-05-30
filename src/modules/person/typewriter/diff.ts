import * as DiffMatchPatch from "diff-match-patch";
const input = `
    type Deadline = {
        timeRemaining: () => number,
        didTimtout: boolean
    }
    type UploadFile = {
        file: File,
        sliceFile?: { file: File, idx: number }[],
        name: string,
        is_create: boolean,
        directory_id: number | null,
        status: string,
        path: string,
        hash_key?: any,
        isExist: boolean,
        uploadSuccess?: boolean,
        precentage?: number,
        type?: string
    }
    type PercentageList = {
        status: string,
        percentage: number
    }
`
const output = `
    type Deadline = {
        timeRemaining: () => number,
        didTimtout: boolean
    }
    type UploadFile = {
        file: File,
        sliceFile?: { file: File, idx: number }[],
        name: string,
        is_create: boolean,
        directory_id: number | null,
        status: string,
        path: string,
        hash_key: any,
        isExist: boolean,
    }

    type PercentageList = {
        status: string,
        percentage: number
    }
`
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
/**
 * @method calculateDiff 计算差异
 */
const calculateDiff = () => {
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
                index += diff[i][1].length
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
                    length: diff[i][1].length
                })
                index += diff[i][1].length;
            }
        }
    }
    getTypeData(handleData)
    return handleData;
}
/**
 * @method getTypeData 获取Typeit需要显示的数据
 * @param handleData 
 */
const getTypeData = (handleData: (AddText | RemovalText | NormalText)[]) => {
    let text = input;
    for (let i = 0; i < handleData.length; i++) {
        if (handleData[i].type == 1) {
            text = text.slice(0, handleData[i].from) + handleData[i].text + text.slice(handleData[i].from);
        } else if (handleData[i].type == 2) {
            text = text.slice(0, handleData[i].from - handleData[i].length) + text.slice(handleData[i].from);
        }
    }
}

export {
    calculateDiff
}