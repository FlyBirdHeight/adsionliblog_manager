export default {
  name: 'TableColumn',
  render(h) {
    return ''
  },
  data() {
    return {
      noWidthCount: 0
    }
  },
  props: {
    prop: String,
    label: String,
    width: String,
    sortable: Boolean,
    align: {
      type: String,
      default: "center"
    }
  },
  mounted() {
    let store = this.$parent.store
    const option = this.getDefaultColumns({
      prop: this.prop,
      label: this.label,
      width: this.width,
      sortable: this.sortable || false,
      align: this.align || "center"
    })
    // store.noWidthCount = this.noWidthCount;
    store.states.columns.push(option)
  },
  methods: {
    getDefaultColumns(options) {
      const column = {}
      for (let name in options) {
        if(name == 'width'){
          if(!options[name]){
            this.$parent.store.noWidthCount++;
          }
        }
        column[name] = options[name]
      }
      return column
    }
  },
}
