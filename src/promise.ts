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
          const x = handle[0].call(undefined, result)
          handle[2].resolveWith(x)
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
         const x = handle[1].call(undefined, reason)
          handle[2].resolveWith(x)
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
    handle[2] = new Promise(()=> {})
    this.callbacks.push(handle)
    return handle[2]
  }

  resolveWith(x) {
    if(this === x ) {
      this.reject(new TypeError('reference can not be same'))
    } else if(x instanceof  Promise) {
      x.then(result=> {
        this.resolve(result)
      }, reason=> {
        this.reject(reason)
      })
    } else if(x instanceof Object) {
      let then
      try {
        then = x.then
      } catch (e) {
        this.reject(e)
      }
      if (then instanceof Function) {
        try {
          x.then(y=> {
            this.resolveWith(y)
          }, r=>
              this.reject(r))
        } catch (e) {
          this.reject(e)
        }
      } else {
        this.resolve(x)
      }
    } else {
      this.resolve(x)
    }
  }

}

export default Promise
