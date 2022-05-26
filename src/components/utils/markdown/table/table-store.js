const TableStore = function (table, initialState) {
    if (!table) {
        throw new Error('Table is required')
    }
    this.table = table
    this.states = {
        columns: []
    }
    this.tableWidth = undefined
    this.tablePositionLeft = undefined;
    this.syncLeft = 0
    this.theaderUid = undefined;
    this.tbodyUid = undefined;
    this.resize = {
        canResize: false,
        isResize: false,
        showResizeLine: false,
        resizeLine: undefined
    }
    this.noWidthCount = 0;
    this.firstRender = false;
}
TableStore.prototype.mutations = {
    calculateTableWidth() {
        if (this.tableWidth && this.noWidthCount != 0 && !this.firstRender) {
            let width = this.tableWidth;
            for (let value of this.states.columns) {
                if (!value['width']) {
                    continue
                } else {
                    width -= value['width'];
                }
            }
            let averageWidth = Math.floor(width / this.noWidthCount);
            this.states.columns.map((currentValue, index) => {
                if (!currentValue.width) {
                    currentValue.width = averageWidth
                }
                return currentValue;
            })
            this.firstRender = true;
            this.noWidthCount = 0;
        } else if (this.noWidthCount == 0) {
            let totalWidth = 0;
            for (let value of this.states.columns) {
                totalWidth += Number(value.width)
            }
            this.tableWidth = totalWidth;
        }
    },
    changeWidth(index, width) {
        let frontWidth = 0;
        for (let key in this.states.columns) {
            if (key == index) {
                break;
            } else {
                frontWidth += Number(this.states.columns[key].width);
            }
        }
        let changeWidth = width - frontWidth;
        this.states.columns[index].width = changeWidth;
        this.commit('calculateTableWidth');
        document.querySelector(`[name=${'th-' + this.table._uid + '-col-column-' + index}]`).width = changeWidth + 'px';

        document.querySelector(`[name=${'tb-' + this.table._uid + '-col-column-' + index}]`).width = changeWidth + 'px';
    },
    handleRowClick(row) {
        this.table.$emit('row-click', row)
    },
    handleHoverEvent(row) {
        this.table.$emit('row-hover', row)
    },
    init() {
        // console.log()
        var rows = document.querySelector(`#table-body${this.tbodyUid}`).children[0].rows
        for (let i = 0; i < rows.length; i++) {
            rows[i].onmouseover = () => {
                rows[i].style.background = 'rgba(222, 236, 238, 0.3)'
            }
            rows[i].onmouseout = () => {
                rows[i].style.background = 'white'
            }
        }

    }
}
TableStore.prototype.commit = function (name, ...args) {
    const mutations = this.mutations
    if (mutations[name]) {
        mutations[name].apply(this, args)
    } else {
        throw new Error(`Action not found ${name}`)
    }
}
export default TableStore
