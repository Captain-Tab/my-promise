// https://juejin.cn/post/6939688892526231582#heading-25
function Promise(executor) {
  //保存promise状态
  this.promiseState = 'pending';
  //保存promise结果
  this.promiseResult = null;
  //用于保存异步回调函数列表
  this.callbackList = [];

  const resolve = val => {
    // 状态只能修改一次
    if (this.promiseState !== 'pending') return;
    // 1. 要去修改Promise对象的状态([[promiseState]]),置为成功fulfilled
    this.promiseState = 'fulfilled';
    // 2. 要去修改Promise对象的状态([[promiseResult]])
    this.promiseResult = val;
    setTimeout(() => {
      // 调用成功的回调【callbackList存起来的】
      for (let callback of this.callbackList) {
        callback.onResolved(val);
      }
    })
  }

  const reject = err => {
    // 状态只能修改一次
    if (this.promiseState !== 'pending') return;
    // 1. 要去修改Promise对象的状态([[promiseState]]),置为失败rejected
    this.promiseState = 'rejected';
    // 2. 要去修改Promise对象的状态([[promiseResult]])
    this.promiseResult = err;
    setTimeout(() => {
      // 调用失败的回调【callbackList存起来的】
      for (let callback of this.callbackList) {
        callback.onRejected(err);
      }
    })
  }
  // 为什么要加try catch 是因为，throw err也相当于调用reject了【前面说过没看过的去补课】
  try {
    /*
    * 同步执行执行器函数
    * 执行器函数接收两个参数，一个是resolve，一个是reject
    */
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
//then方法
Promise.prototype.then = function (onResolved, onRejected) {
  const self = this;
  //处理异常穿透 并且为onResolved，onRejected设置默认值。因为这两个参数可以都不传
  if (typeof onRejected !== 'function') {
    onRejected = err => {
      throw err;
    }
  }
  if (typeof onResolved !== 'function') {
    onResolved = val => val;
  }
  // then方法会返回Promise
  return new Promise((resolve, reject) => {
    // 对返回值的处理进行封装
    const handleCallback = (callback) => {
      // 如果回调函数中抛出错误，则reject
      try {
        // 需要依据回调的返回结果确定then方法的返回值
        // 现在的this会指向return的promise对象，所以使用self
        const res = callback(self.promiseResult);
        if (res instanceof Promise) {
          //如果回调返回结果是个Promise
          res.then(val => {
            resolve(val);
          }, err => {
            reject(err);
          })
        } else {
          // 返回结果不是Promise
          resolve(res);
        }
      } catch (err) {
        reject(err);
      }
    }
    //调用回调函数
    if (this.promiseState === 'fulfilled') {
      setTimeout(() => {
        handleCallback(onResolved);
      })
    }
    if (this.promiseState === 'rejected') {
      setTimeout(() => {
        handleCallback(onRejected);
      })
    }
    /*
    * 如果是pending状态，则异步任务，在改变状态的时候去调用回调函数
    * 所以要保存回调函数
    * 因为promise实例阔以指定多个回调，于是采用数组 
    */
    if (this.promiseState === 'pending') {
      console.log('waiting')
      this.callbackList.push({
        onResolved: () => {
          handleCallback(onResolved);
        },
        onRejected: () => {
          handleCallback(onRejected);
        }
      })
    }
  })
}

//catch方法
Promise.prototype.catch = function (onRejected) {
  //  我们可以直接使用then方法实现
  return this.then(undefined, onRejected);
}

//finally方法
Promise.prototype.finally = function (callback) {
  return this.then((value) => {
    return Promise.resolve(callback).then(()=> value)
  }, (error) => {
    return Promise.resolve(callback).then(() => { throw error})
  })
}

//resolve方法
Promise.resolve = function (val) {
  //返回值的情况在前文说过，可以在 Promise的使用一章找到
  return new Promise((resolve, reject) => {
    if (val instanceof Promise) {
      val.then(val => {
        resolve(val);
      }, err => {
        reject(err);
      });
    } else {
      resolve(val);
    }
  })
}

//reject方法
Promise.reject = function (err) {
  //返回值的情况在前文说过，可以在 Promise的使用一章找到
  return new Promise((resolve, reject) => {
    reject(err);
  })
}

//all
Promise.all = function (promiseList) {
  let count = 0;
  let res = [];
  const length = promiseList.length;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < length; i++) {
      promiseList[i].then(val => {
        count++;
        res[i] = val;
        if (count === length) {
          resolve(res);
        }
      }, err => {
        reject(err);
      });
    }
  })
}

//race
Promise.race = function (promiseList) {
  const length = promiseList.length;
  //谁先完成谁就决定结果！
  return new Promise((resolve, reject) => {
    for (let i = 0; i < length; i++) {
      promiseList[i].then(val => {
        resolve(val);
      }, err => {
        reject(err);
      });
    }
  })
}

let p1 = Promise.resolve(1)
p1.then((value) => {
  console.log('11', value);
}).then((value) => {
  throw 'err';
}).then((value) => {
  console.log(22);
}).catch((e) => {
  console.log('error'. e)
})

let p3 = Promise.resolve(1);
p3.then((value) => {
  const test = Promise.resolve('tab')
  return test
}).then((value) => {
  console.log('value2', value)
})

let p4 = new Promise((resolve, reject) => {
  // asynchronous
  setTimeout(() => {
    resolve(2) 
  }, 1000)
})

p4.then((res) => {
  console.log('res', res)
})


function* myGenerator() {
  console.log(yield Promise.resolve(1))   //1
  console.log(yield Promise.resolve(2))   //2
  console.log(yield Promise.resolve(3))   //3
}

// 手动执行迭代器
const gen = myGenerator()
gen.next().value.then(val => {
  console.log('1', val)
  gen.next(val).value.then(val => {
    console.log('2', val)
    gen.next(val).value.then(val => {
      console.log('3', val)
      gen.next(val)
    })
  })
})