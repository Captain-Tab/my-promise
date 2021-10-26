// https://segmentfault.com/a/1190000022638499
// https://javascript.info/generators

// [Basic Version1] auto execute generator
function* myGenerator1() {
  console.log(yield Promise.resolve(1))   //1
  console.log(yield Promise.resolve(2))   //2
  console.log(yield Promise.resolve(3))   //3
}

const gen1 = myGenerator1()
gen.next().value.then(val => {
  gen.next(val).value.then(val => {
    gen.next(val).value.then(val => {
      gen.next(val)
    })
  })
})


// [Basic Version2] auto execute generator
function* myGenerator2() {
  console.log(yield Promise.resolve(1))   //1
  console.log(yield Promise.resolve(2))   //2
  console.log(yield Promise.resolve(3))   //3
}

function run(gen) {
  const generator = gen()

  const next = (value) => {
    const res = generator.next(value)
    if (res.done) return res.value
    res.value.then(val => {
      next(val)
    })
  }
  next()
}

// [Basic Version3] auto execute generator
function* myGenerator3() {
  try {
    console.log(yield Promise.resolve(1))
    console.log(yield Promise.resolve(5))
    console.log(yield Promise.resolve(9))
    // console.log(yield 2)   //2
    yield Promise.resolve(7)
    // console.log(yield Promise.reject('error'))
  } catch (error) {
    console.log(error)
  }
}

function run(gen) {
  // wrap the return value with promise, since the aysnc returns promise
  return new Promise((resolve, reject) => {
    const generator = gen()
    
    const next = (value) => {
      // error handle
      let res
      try {
        res = generator.next(value)
      } catch (err) {
        return reject(err)
      }
      if (res.done) {
        return resolve(res.value)
      }
      // wrap res.value with promise, since we need to compatible
      Promise.resolve(res.value).then(val => {
        next(val)
      }, err => {
        // throw error
        generator.throw(err)
      })
    }
    next()
  })
}

const result = run(myGenerator3)
console.log('result', result)
setTimeout(() => {
  result.then(res => {
    console.log('end', res)
  })
}, 1000)


// how babel works 
// 相当于我们的run()
function _asyncToGenerator(fn) {
  // return一个function，和async保持一致。我们的run直接执行了Generator，其实是不太规范的
  return function () {
    var self = this
    var args = arguments
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      //相当于我们的_next()
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      //处理异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

const foo = _asyncToGenerator(function* () {
  try {
    console.log(yield Promise.resolve(1))   //1
    console.log(yield 2)                    //2
    return '3'
  } catch (error) {
    console.log(error)
  }
})

foo().then(res => {
  console.log(res)                          //3
})
