import AnalysisIndex from "./index.js"
class OrderList extends AnalysisIndex{
    constructor(){
        super();
        this.orderListReg = {
            start: /^(?<orderlistNumber>\d{1,5}\.)\s.+/gi,
            end: /^(\s*)(\n*)?$/i
        }
    }
}

export default OrderList;