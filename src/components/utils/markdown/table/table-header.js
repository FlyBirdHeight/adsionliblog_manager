import './table-header.scss'

export default {
  name: 'TableHeader',
  render() {
    const columns = this.$parent.store.states.columns
    const width = this.$parent.store.tableWidth;
    const uId = this.$parent._uid;
    return (
      <div ref="tableHeader" ref={`table-header${this._uid}`} id={`table-header${this._uid}`} class="table_header-column">
        <table class='tableStyle' cellspacing="0" cellpadding="0" border="0" style={`width: ${width}px`}>
          <colgroup>
            {
              this._l(columns, (column, index) =>
                <col style={`text-align:${column.align || 'center'}`} name={'th-' + uId + '-col-column-' + (index)} width={column.width ? column.width : ''} />
              )
            }
          </colgroup>
          <thead>
            <tr class='theadStyle' id={`th${this._uid}`}>
              {
                this._l(columns, (column, index) =>
                  <th  class={`theadTd ${'th-column-' + (index)}`}>
                    <div domPropsInnerHTML={column.label}> </div>
                    {column.sortable
                      ? <span>
                        <i on-click={() => this.sortUp(column)} class={'triangle_up'} />
                        <i on-click={() => this.sortDown(column)} class={'triangle_down'} />
                      </span> : ''
                    }
                  </th>
                )
              }
            </tr>
          </thead>
        </table>
      </div>
    )
  },
  data() {
    return {
      tableHeader: undefined
    }
  },
  mounted() {
    this.tableHeader = document.querySelector(`#table-header${this._uid}`)
    this.$parent.store.theaderUid = this._uid
    //NOTE: 记录一下表格头有鼠标移动入了之后，可以控制改变表格的列宽
    this.handleEventListener();
  },
  methods: {
    /**
     * @method handleEventListener 处理表格头部的控制列宽的改变
     */
    handleEventListener() {
      var headerRows = document.querySelector(`#table-header${this._uid}`).children[0].rows
      let resize = this.$parent.store.resize;
      
      //鼠标移动事件
      headerRows[0].onmousemove = (e) => {
        if (e.offsetX > 0 && Math.abs(e.path[0].clientWidth - e.offsetX) < 5) {
          resize.canResize = true;
          document.body.style.cursor = 'col-resize'
        } else {
          document.body.style.cursor = 'default'
          if (!resize.isResize) {
            resize.canResize = false;
            resize.showResizeLine = false;
          }
        }
      }
      // //鼠标按下事件
      // headerRows[0].onmousedown = (e) => {
      //   if (resize.canResize) {
      //     resize.isResize = true;
      //     resize.showResizeLine = true;
      //     let checkedHeader = undefined;
      //     let store = this.$parent.store;
      //     if(e.path[0].className == ''){
      //       checkedHeader = e.path[1].className.match(/(\d+)?$/gi)[0];
      //     }else{
      //       checkedHeader = e.path[0].className.match(/(\d+)?$/gi)[0];
      //     }
      //     function bodyMouseUp(e) {
      //       if (resize.isResize) {
      //         document.removeEventListener('mousemove', bodyMouseMove)
      //         resize.isResize = false;
      //         resize.showResizeLine = false;
      //         resize.canResize = false;
      //         let changeWidth = resize.resizeLine.getBoundingClientRect().left - store.tablePositionLeft;
      //         store.commit('changeWidth', ...[checkedHeader, changeWidth]);
      //       }
      //     }
      //     function bodyMouseMove(e) {
      //       resize.resizeLine.style = 'left:' + (e.clientX - store.tablePositionLeft) + 'px'
      //       document.onmouseup = bodyMouseUp;
      //     }
          
      //     document.addEventListener('mousemove', bodyMouseMove)
      //   }
      // }

      // //鼠标松开事件
      // headerRows[0].onmouseup = (e) => {
      //   resize.isResize = false;
      //   resize.showResizeLine = false;
      //   resize.canResize = false;
      // }
      //鼠标移出事件
      headerRows[0].onmouseout = (e) => {
        document.body.style.cursor = 'default'
        if (!resize.isResize) {
          resize.canResize = false;
          resize.showResizeLine = false;
        }
      }
    },
    sortDown(item) {
      let keyVal = item.prop
      const data = this.$parent.dataSource
      data.sort((a, b) => {
        return b[keyVal] - a[keyVal]
      })
    },
    sortUp(item) {
      let keyVal = item.prop
      const data = this.$parent.dataSource
      data.sort((a, b) => {
        return a[keyVal] - b[keyVal]
      })
    }
  },
  watch: {
    '$parent.store.syncLeft': function (newV, oldV) {
      if (typeof (this.tableHeader) != 'undefined') {
        this.tableHeader.scrollLeft = newV;
      }
    }
  }
}