import * as chai from 'chai';

const assert = chai.assert;
import Promise from '../src/promise'

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
    let called = false
    const promise = new Promise((resolve, reject)=> {
      called = true
      assert.isFunction(resolve)
      assert.isFunction(reject)
    })
    // @ts-ignore
    assert(called === true)
  })
  it('Promise will excute success function after reslove has been called', (done)=> {
    let called = false
    const promise = new Promise((resolve, reject)=> {
      assert(called === false)
      resolve()
      setTimeout(()=> {
        assert(called === true)
        done()
      },0) 
    })
    // @ts-ignore
    promise.then(()=> {
      called = true
    })
  })

});