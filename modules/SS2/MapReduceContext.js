
const MapContext = class MapContext {
  constructor(key, value){
    this.key = key;
    this.value = value;
  }
}

const ReduceContext = class ReduceContext{
  constructor(key, values){
    this.key = key;
    this.values = values;
  }

}

const SummaryContext = class SummaryContext{
  constructor(){
    var that = this;
    this.summaryOutput = {}
    this.output = {
      iterator: function(){
        return {
          each: function(callback){
            Object.keys(that.summaryOutput).map(function(key){
              callback(key,that.summaryOutput[key])
            })
          }
        }
      }
    }
  }
}

module.exports =  class MapReduceContext {
  constructor(array){
    var keys = Object.keys(array);
    var mrcontext = this;
    this.mapContexts =  array.map(function(elem,idx){
      var mc = new MapContext(keys[idx], JSON.stringify(elem))
      mc.write = function(key, val){
        var found = mrcontext.reduceContexts.find(function(elem){
          return elem.key === key
        });
        if(!found){
          found = new ReduceContext(key, [JSON.stringify(val)])
          found.write = function(rkey,rval){
            if(mrcontext.summaryContext.summaryOutput[rkey] == undefined){
                mrcontext.summaryContext.summaryOutput[rkey] = []
            }
            mrcontext.summaryContext.summaryOutput[rkey].push(JSON.stringify(rval))
          } 

          mrcontext.reduceContexts.push(found)
          return
        }
        found.values.push(JSON.stringify(val))
        

      }
      return mc

      });
    this.summaryContext = new SummaryContext()
    this.reduceContexts = [] 
  }

  convertReduceContextToSummaryContext(){
    this.reduceContexts.forEach((context)=>{
      this.summaryContext.summaryOutput[context.key] = context.values
    })
  }
}
