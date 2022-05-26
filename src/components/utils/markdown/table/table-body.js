import './table-body.scss'

export default {
  name: 'TableBody',
  render() {
    const columns = this.$parent.store.states.columns
    let options = []
    columns.map(function (column) {
      options.push(column['prop'])
    })
    const dataSource = this.$parent.dataValueList
    const width = this.$parent.store.tableWidth;
    const uId = this.$parent._uid;
    return (
      <div class="table_body-wrapper" ref={`table-body${this._uid}`} id={`table-body${this._uid}`}>
        <table class="table_body-table" cellspacing="0" cellpadding="0" border="0" style={'width:' + width + 'px'}>
          <colgroup>
            {
              this._l(columns, (column, index) =>
                <col style={`text-align:${column.align || 'center'}`} name={'tb-' + uId + '-col-column-' + (index)} width={column.width ? column.width : ''} />
              )
            }
          </colgroup>
          <tbody>
            {
              dataSource.length > 0
                ? this._l(dataSource, item =>
                  <tr on-click={() => this.clickTr(item)}
                    on-mouseover={() => this.handleHoverEvent(item)} >
                    {
                      this._l(options, (option, index) =>
                        <td class={`tdStyle ${'td-column-' + (index)}`}>
                          <div domPropsInnerHTML={item[option]}></div>
                        </td>
                      )
                    }
                  </tr>
                ) : <tr></tr>
            }
          </tbody>
        </table>
        {dataSource.length == 0? <div style={`width: ${width}px`} class="table_body-no-data"><span class="empty-label">{this.$parent.emptyText}</span></div> : ''}
      </div>
    )
  },
  mounted() {
    this.$parent.store.tbodyUid = this._uid;
    document.querySelector(`#table-body${this._uid}`).addEventListener('scroll', (e) => {
      let offsetLeft = e.target.scrollLeft;
      this.$parent.store.syncLeft = offsetLeft;
    })
  },
  methods: {
    clickTr(items) {
      this.$parent.store.commit('handleRowClick', items)
    },
    handleHoverEvent(row) {
      this.$parent.store.commit('handleHoverEvent', row)
    }
  }
}
