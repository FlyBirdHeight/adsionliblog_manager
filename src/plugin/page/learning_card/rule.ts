const LearningCardRule = {
    title: [
        {
            required: true,
            message: "闪卡主题不可为空",
            trigger: 'blur'
        },
        {
            max: 50,
            message: "闪卡主题长度不可超过50个字符",
            trigger: 'blur'
        }
    ],
    creator: [
        {
            required: true,
            message: "创建人不可为空",
            trigger: 'blur'
        },
    ]
}

const QuestionRule = {
    title: [
        {
            required: true,
            message: "问题内容不可为空",
            trigger: 'blur'
        },
        {
            max: 200,
            message: "问题内容长度不可超过200个字符",
            trigger: 'blur'
        }
    ],
    solution: [
        {
            required: true,
            message: "问题答案不可为空",
            trigger: 'blur'
        }
    ],
}

export {
    LearningCardRule,
    QuestionRule
}