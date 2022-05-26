<template>
  <div class="table" :id="`table${_uid}`">
    <table-header class="table-header"></table-header>
    <slot></slot>
    <table-body class="table-body"></table-body>
    <div
      :id="`tableResize${_uid}`"
      v-show="store.resize.showResizeLine"
      class="resize-table-column-width"
    ></div>
  </div>
</template>

<script>
//TODO 还可以看法的功能：1.固定列 2：固定头 3.多级表头(合并表头) 4. 单选
// 5. 多选 6.在table-column加入模板语言，然后放入tbody中去 7. 展开行
import TableStore from "./table-store.js";
import TableLayout from "./table-layout.js";
import TableColumn from "./table-column.js";
import TableHeader from "./table-header.js";
import TableBody from "./table-body.js";
import AnaysisIndex from "@/modules/analysis/utils/index.js";
export default {
  data() {
    const store = new TableStore(this);
    const layout = new TableLayout({
      table: this,
      store: store,
    });
    return {
      store,
      layout,
      dataValueList: this.dataList,
      emptyText: "暂无数据",
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.store.tableWidth = this.$el.clientWidth - 2;
      this.store.commit("calculateTableWidth");
    });

    if (typeof this.dataValueList == "string") {
      this.dataValueList = this.dataValueList.replace(/'/g, '"');
      this.dataValueList = JSON.parse(this.dataValueList);
      let anaysisIndex = new AnaysisIndex();
      for (let value of this.dataValueList) {
        if(Object.keys(value).length > 0){
          for(let key in value){
            value[key] = anaysisIndex.matchSpecialChar(value[key])
          }
        }
      }
    }
    this.store.commit("init");
    this.store.tablePositionLeft = document
      .querySelector(`#table${this._uid}`)
      .getBoundingClientRect().left;
    this.store.resize.resizeLine = document.querySelector(
      `#tableResize${this._uid}`
    );
  },
  props: {
    dataList: {
      type: [Array, String],
      default: () => {
        return [];
      },
    },
    height: [String, Number],
  },
  methods: {},
  components: {
    TableHeader,
    TableBody,
    TableColumn,
  },
};
</script>

<style lang="scss" scoped>
.table {
  margin: 20px;
  position: relative;
  .resize-table-column-width {
    position: absolute;
    left: 200px;
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 1px solid #ebeef5;
    z-index: 10;
  }
}
table {
  border-spacing: 0px;
  color: #606266;
}
.table-header,
.table-body {
  border: 1px solid #ebeef5;
}
.table-body {
  border-top: none;
  // border-bottom: none;
}
.table-header {
  border-bottom: none;
}
</style>
