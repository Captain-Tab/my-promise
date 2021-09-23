import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Promise from '../src/promise';
chai.use(sinonChai)


const assert = chai.assert;

describe("Promise", ()=> {
  it("is class", ()=> {
    assert.isFunction(Promise)
    assert.isObject(Promise.prototype)
  })
  it("params is function type", ()=> {
    assert.throw(()=> {
      // @ts-ignore
      new Promise(1)
    })
    assert.throw(()=> {
      // @ts-ignore
      new Promise(false)
    })
  })
  it('new Promise returns an object with then function inside', ()=> {
    const promise = new Promise(()=> {})
    assert.isFunction(promise.then)
  })
  it('new Promise excute fn function immediately', ()=> {
    let fn = sinon.fake()
    new Promise(fn)
    assert(fn.called)
  })
  it('new Promise(fn) 中的fn receive two functions', (done)=> {
    new Promise((resolve, reject)=> {
      assert.isFunction(resolve)
      assert.isFunction(reject)
      done()
    })
  })
  it('Promise will execute success function after resolve has been called', (done)=> {
    const success = sinon.fake()
    const promise = new Promise((resolve, reject)=> {
      assert.isFalse(success.called)
      resolve()
      setTimeout(()=> {
        assert.isTrue(success.called)
        done()
      })
    })
    // @ts-ignore
    promise.then(success)
  })
  it('Promise will execute fail function after reject has been called', (done)=> {
    const fail = sinon.fake()
    const promise = new Promise((resolve, reject)=> {
      assert.isFalse(fail.called)
      reject()
      setTimeout(()=> {
        assert.isTrue(fail.called)
        done()
      })
    })
    // @ts-ignore
    promise.then(null,fail)
  })
  it('Promise.then receive function type parameter', ()=> {
      const promise = new Promise(resolve=> {
        resolve()
      })
    promise.then(false, null)
    assert(1 === 1)
  })
  it('onFulfilled function will be called after promise done', (done)=> {
    const succeed = sinon.fake()
    const promise = new Promise(resolve=> {
      assert.isFalse(succeed.called)
      resolve(233)
      resolve(234)
      setTimeout(()=> {
        assert(promise.state === 'fulfilled')
        assert.isTrue(succeed.calledOnce)
        assert(succeed.calledWith(233))
        done()
      }, 0)
    })
    promise.then(succeed)
  })
  it('onRejected function will be called after promise failed', (done)=> {
    const fail = sinon.fake()
    const promise = new Promise((resolve, reject)=> {
      assert.isFalse(fail.called)
      reject(233)
      reject(234)
      setTimeout(()=> {
        assert(promise.state === 'rejected')
        assert.isTrue(fail.calledOnce)
        assert(fail.calledWith(233))
        done()
      }, 0)
    })
    promise.then(null, fail)
  })
  it(' 2.2.3 could not call then functions before code execute', (done)=> {
    const succeed = sinon.fake()
    const promise = new Promise((resolve)=> {
      resolve()
    })
    promise.then(succeed)
    console.log(1)
    assert.isFalse(succeed.called)
    setTimeout(()=> {
      assert.isTrue(succeed.called)
      done()
    },0)
  })
  it('2.2.5 onFulfilled and onRejected must be called as functions', (done)=> {
    const promise = new Promise(resolve => {
      resolve()
    })
    promise.then(function (){
      'use strict'
      assert(this === undefined)
      done()
    })
  })
  it('2.2.6 then could be called multiple times by same promise', (done)=> {
    const promise = new Promise(resolve => {
      resolve()
    })
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()]
    promise.then(callbacks[0])
    promise.then(callbacks[1])
    promise.then(callbacks[2])
    setTimeout(()=> {
      assert(callbacks[0].called)
      assert(callbacks[1].called)
      assert(callbacks[2].called)
      assert(callbacks[1].calledAfter(callbacks[0]))
      assert(callbacks[2].calledAfter(callbacks[1]))
      done()
    }, 0)
  })
  it('2.2.7 promise.then returns promise', ()=> {
    const promise = new Promise(resolve => {
      resolve()
    })
    const promise2 = promise.then(()=> {}, ()=> {})
    assert(promise2 instanceof  Promise)
  })
  it('2.2.7.1', (done)=> {
    const promise = new Promise(resolve => {
      resolve()
    })
    promise.then(()=> 'succeed', ()=> 'fail').then((result)=> {
      assert.equal(result, 'succeed')
      done()
    })
  })
  it('2.2.7.2, x is a promise', (done)=> {
    const promise = new Promise(resolve => {
      resolve()
    })
    const fn = sinon.fake()
    const promise2 = promise.then(()=> new Promise((resolve)=> {resolve()}))
    promise2.then(fn)
    setTimeout(()=> {
      assert(fn.called)
      done()
    }, 10)
  })
});
