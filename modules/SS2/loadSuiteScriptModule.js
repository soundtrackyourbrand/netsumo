const fs = require('fs');
const Module = require('module');

function define(modules, factory) {
  return (requiredModules) => {

    var modulesToImport = modules.map((module=>{
      return requiredModules[module];
    }));

    return factory.apply(null, modulesToImport);
  }
}

function loadSuiteScriptModule(filePath) {

  const contentsToReplace = "define(";
  const replacementExport = "module.exports = define("

  //global netsuite objects
  const log = "const log = {debug: (title,details)=>{console.log('\x1b[36m%s %s\x1b[0m', title, details);},audit: (title,details)=>{},emergency: (title,details)=>{},error: (title,details)=>{console.log('\x1b[31m%s %s\x1b[0m',title,details)}};"
  const util = "const util = {isArray: (arr)=>{return Array.isArray(arr)}, each: (object,cb)=>{ if(Array.isArray(object)){for(var i = 0; i < object.length; i++){ cb(object[i], i)}} else { var keys = Object.keys(object); for(var i = 0; i < keys.length; i++){ cb(object[keys[i]], keys[i])}}}};"

  var contents = fs.readFileSync(filePath, 'utf8');
  contents = contents.replace(contentsToReplace,`${log} ${util} ${define.toString().replace(/\n/g,'')} ${replacementExport}`);
  var m = new Module();
  m._compile(contents, filePath);
  return m.exports;
}

module.exports = loadSuiteScriptModule;
