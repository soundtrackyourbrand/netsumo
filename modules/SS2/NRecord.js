const Record = require("./Record")

module.exports = class NRecord {
  constructor(store) {
    this.Record = Record;
    this.Type = {
      ITEM_FULFILLMENT:"itemfulfillment",
      CUSTOMER:"customer",
      ITEM:"item",
      LOCATION:"location",
      SALES_ORDER:"salesorder",
      NON_INVENTORY_ITEM: "noninventoryitem",
      INVOICE: "invoice"
    }
    this.records = [];
    if(store){
      this.records = store
    }
  }

  create(options) {
    options.records = this.records
    return new Record(options)
  }

  load(options) {
    var records = this.records.filter(record => (record.id == options.id && record.type == options.type));
    if(records && records.length > 0) {
      return records[0]
      } else {
        var e =  new Error('That record does not exist')
        e.name = 'RCRD_DSNT_EXIST'
        throw e
      }
  }

  addRecord(record) {
    this.records.push(record)
  }

  transform(options){
    if(options.fromType === this.Type.SALES_ORDER && options.toType === this.Type.INVOICE){
      return this._tranformSalesOrderToInvoice(options)
    } else {
      throw new Error('NOT_IMPLMENTED_TRANFORM_IN_TESUITE')
    }
  }

  _tranformSalesOrderToInvoice(options){     
    var fromRecord = this.load({
      type: options.fromType,
      id: options.fromId
    })
    
    var toRecord = this.create(fromRecord)

    toRecord.type = options.toType
    toRecord.id = undefined
    toRecord.setValue({
      fieldId: 'tranid',
      value: 'CU10000-100-'+1000+options.fromId
    })
    
    toRecord.tmpSave = toRecord.save
    toRecord.save = function(){
      var recId = this.tmpSave()
      console.log('recId',recId)
      fromRecord.setSublistValue({
        sublistId: 'links',
        fieldId: 'type',
        line: 0,
        value: 'Invoice'
      })
      fromRecord.setSublistValue({
        sublistId: 'links',
        fieldId: 'id',
        line: 0,
        value: recId
      })
      fromRecord.save()
      return recId
    }


    return toRecord
  }
    
    
}
