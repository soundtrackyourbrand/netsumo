var libbase64 = require('libbase64')

module.exports = class NEncode {
  constructor(){
    this.Encoding = {
      UTF_8: 'utf8',
      BASE_64: 'base64'
    }
  }

  convert(options){
    switch(options.inputEncoding){
      case this.Encoding.UTF_8:
        return this.convertFromUTF8(options)
        break
      default:
        throw new Error('INPUT_ENCODING_TYPE_NOT_IMPLEMENTED')
    }    
  }

  convertFromUTF8(options){
    switch(options.outputEncoding){
      case this.Encoding.BASE_64:
        return this.convertToBase64(options)
        break
      default:
        throw new Error('OUTPUT_ENCODING_TYPE_NOT_IMPLEMENTED')
    }
  }

  convertToBase64(options){
    return libbase64.encode(options.string)
  }
}



