type PaginationConfig = {
    total: number,
    page: number,
    count: number,
    pageList?: number[]
}

type TableConfig = {
    border?: boolean,
    height?: 600,
    size?: string,
    fit?: boolean,
    showHeader?: boolean,
    highlightCurrentRow?: boolean,
    rowStyle?: any,
}

export {
    PaginationConfig,
    TableConfig
}