import { doesNotReject, rejects } from 'assert';
import * as chai from 'chai';
import { resolve } from 'dns';
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
  it('Promise will excute success function after reslove has been called', (done)=> {
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
});