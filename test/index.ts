import * as chai from 'chai';
import { type } from 'os';

const assert = chai.assert;
import Promise from '../src/promise'

describe("Promise", ()=> {
  it("is class", ()=> {
    assert.isFunction(Promise)
    assert.isObject(Promise.prototype)
  })
});