const NRecord = require('./Nrecord')
const Search = class Search {
  constructor(options){
    this.type = options.type
    this.filters = options.filters
    this.columns = options.columns
    this.records = options.records
  }

    
  runPaged(){
    return {
      count: 0
    }
  }
  run(){
    var recs = this.records.filter(record => (  record.type === this.type && record[this.filters[0].name].value === this.filters[0].values[0]))
    return new ResultSet(recs)
    
  }
      
}

const ResultSet = class ResultSet {
  constructor(result){
    this.result = result
  }

  getRange(start, end){
    return this.result.slice(start,end)
  }
}
    
module.exports = class NSearch {
  constructor(store) {
    this.Type = {
      CUSTOMER:"customer",
      ITEM:"item",
      LOCATION:"location",
      SALES_ORDER:'salesorder',
      INVOICE:'invoice',
    }
    this.Operator = {
      IS: "is",
      ANYOF: "anyof"
    }
    this.records = [];
    if(store){
      this.records = store
    }
  }

  lookupFields(data) {
    var records = this.records.filter(record => (record.id == data.id && record.type == data.type));
    var response = {};
    if(records && records.length > 0) {
      var record = records[0];
      for(let column of data.columns) {
          response[column] = record.getValue(column)
      }
    }

    return response;
  }

  addRecord(record) {
    this.records.push(record)
  }

  create(options){
    options.records = this.records
    return new Search(options) 
  }
}
