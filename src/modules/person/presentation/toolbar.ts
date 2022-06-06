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
    handle: "",
    label: "添加文字框"
}, {
    icon: "image",
    handle: "",
    label: "添加图片"
}, {
    icon: "code",
    handle: "",
    label: "添加代码段"
}, {
    icon: "bg-color",
    handle: "",
    label: "设置背景"
}, {
    icon: "link",
    handle: "",
    label: "添加链接"
}, {
    icon: "divide",
    handle: "",
    label: ""
}, {
    icon: "bringtobottom",
    handle: "",
    label: "置于底层"
}, {
    icon: "bringtotop",
    handle: "",
    label: "置于顶层"
}, {
    icon: "fullscreen",
    handle: "",
    label: "全屏设置"
}, {
    icon: "divide",
    handle: "",
    label: ""
}, {
    icon: "shunxubofang",
    handle: "",
    label: "播放顺序"
}, {
    icon: "tianjiadonghua",
    handle: "",
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
    handle: "",
    label: "第一页"
},{
    icon: "shangyiye",
    handle: "",
    label: "上一页"
},{
    icon: "xiayiye",
    handle: "",
    label: "下一页"
},{
    icon: "jiantou_xiayiye",
    handle: "",
    label: "最后一页"
},{
    icon: "divide",
    handle: "",
    label: ""
}, {
    icon: "configure",
    handle: "",
    label: "设置"
}]



export {
    toolbarList
}