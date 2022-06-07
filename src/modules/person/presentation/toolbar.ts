import { PresentationToolbar } from "@/modules/type/site/person/person";

const toolbarList: PresentationToolbar[] = [{
    icon: "undo",
    handle: "revokeAction",
    label: "撤销"
}, {
    icon: "redo",
    handle: "recoveryAction",
    label: "恢复"
}, {
    icon: "divide",
    handle: "",
    label: ""
}, {
    icon: "font-color",
    handle: "addTextArea",
    label: "添加文字框"
}, {
    icon: "image",
    handle: "addImage",
    label: "添加图片"
}, {
    icon: "code",
    handle: "addCode",
    label: "添加代码段"
}, {
    icon: "bg-color",
    handle: "settingBackground",
    label: "设置背景"
}, {
    icon: "link",
    handle: "addLink",
    label: "添加链接"
}, {
    icon: "divide",
    handle: "",
    label: ""
}, {
    icon: "bringtobottom",
    handle: "setBottom",
    label: "置于底层"
}, {
    icon: "bringtotop",
    handle: "setTop",
    label: "置于顶层"
}, {
    icon: "fullscreen",
    handle: "fullScreen",
    label: "全屏设置"
}, {
    icon: "divide",
    handle: "",
    label: ""
}, {
    icon: "shunxubofang",
    handle: "settingAnimationShow",
    label: "播放顺序"
}, {
    icon: "tianjiadonghua",
    handle: "settingAnimation",
    label: "设置动画"
}, {
    icon: "divide",
    handle: "",
    label: ""
},
{
    icon: "addpage",
    handle: "addPage",
    label: "新建页面"
},{
    icon: "delpage",
    handle: "deletePage",
    label: "删除页面"
},{
    icon: "jiantou_shangyiye",
    handle: "goFirst",
    label: "第一页"
},{
    icon: "shangyiye",
    handle: "goPre",
    label: "上一页"
},{
    icon: "xiayiye",
    handle: "goNext",
    label: "下一页"
},{
    icon: "jiantou_xiayiye",
    handle: "goEnd",
    label: "最后一页"
},{
    icon: "divide",
    handle: "",
    label: ""
}, {
    icon: "configure",
    handle: "setting",
    label: "设置"
}]



export {
    toolbarList
}