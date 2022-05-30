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

enum ShowConfig {
    "MAX_LENGTH" = 50,
    "DELETE_STOP_TIME" = 40,
    "INSERT_STOP_TIME" = 80
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
            }
            index += diff[i][1].length
        }
    }

    return getTypeData(handleData);
}
/**
 * @method getTypeData 获取Typeit需要显示的数据
 * @param handleData 
 */
const getTypeData = (handleData: (AddText | RemovalText | NormalText)[]) => {
    let editList = [];
    for (let i = 0; i < handleData.length; i++) {
        let from = handleData[i].type == 2 ? handleData[i].from - handleData[i].length : handleData[i].from
        let insertProps = handleData[i].length > ShowConfig.MAX_LENGTH ? { instant: true } : { delay: ShowConfig.INSERT_STOP_TIME };
        editList.push({
            fn: 'type',
            props: Object.assign({ data: handleData[i].type === 1 ? handleData[i].text?.replace(/\n/g, "<br>").replace(/\s/g, '&nbsp;') : input.slice(from, from + handleData[i].length).replace(/\n/g, "<br>").replace(/\s/g, '&nbsp;') }, { options: insertProps })
        })
        if (handleData[i].type === 2) {
            let props = handleData[i].length > ShowConfig.MAX_LENGTH ? { instant: true } : { delay: ShowConfig.DELETE_STOP_TIME };
            editList.push({
                fn: "delete",
                props: Object.assign({ data: handleData[i].length }, { options: props })
            })
        }
    }

    return editList;
}

export {
    calculateDiff
}