interface CategoryForm {
    name: string,
    desc?: string,
    is_show?: boolean,
    is_recommend?: boolean,
    sort?: number
}

const validateName = {
    type: 'string',
    required: true,
    message: '请输入分类名称',
    trigger: 'change',
}

export {
    CategoryForm,
    validateName
}