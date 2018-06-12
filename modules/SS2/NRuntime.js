const Script = class Script{
  constructor(){
    this.Parameters = {}
  }

  getParameter(name){
    return this.Parameters[name]
  }
  
  setParameter(options){
    this.Parameters[options.name] = options.value;
  }
    
}

module.exports = class NRuntime{
  constructor() {
    this.Script = new Script()
  }

  setParameter(options){
    this.Script.setParameter(options)
  }

  getCurrentScript(){
    return this.Script
  }
}
