class Promise {
  success = null
  fail = null

  resolve () {
    setTimeout(()=>{
      this.success()
    },0)
  }

  reject () {
    setTimeout(()=>{
      this.fail()
    },0)
  }
  constructor(fn: Function) {
    if(typeof fn !== 'function') {
      throw new Error('the parameter has to be Function type')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(success, fail) {
    this.success = success
    this.fail = fail
  }
}

export default Promise