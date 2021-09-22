class Promise {
  state = 'pending'
  callbacks = []


  constructor(fn: Function) {
    if(typeof fn !== 'function') {
      throw new Error('the parameter has to be Function type')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }

  resolve (result) {
    if(this.state !== 'pending') {
      return
    }
    this.state = 'fulfilled'
    setTimeout(()=>{
      this.callbacks.forEach(handle => {
        if(typeof handle[0] === 'function') {
          handle[0].call(undefined, result)
        }
      })
    },0)
  }

  reject (reason) {
    if(this.state !== 'pending'){
      return
    }
    this.state = 'rejected'
    setTimeout(()=>{
      this.callbacks.forEach(handle => {
        if(typeof handle[1] === 'function') {
          handle[1].call(undefined, reason)
        }
      })
    },0)
  }

  then(success?, fail?) {
    const handle = []
    if(typeof success === 'function') {
      handle[0] = success
    }
    if(typeof fail === 'function') {
      handle[1] = fail
    }
    this.callbacks.push(handle)
  }
}

export default Promise
