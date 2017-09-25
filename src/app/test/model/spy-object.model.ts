/* This code is taken from the Angular source code and is used by Angular to internally test itself.
src: https://github.com/angular/angular/blob/b0cebdba6b65c1e9e7eb5bf801ea42dc7c4a7f25/modules/angular2/src/testing/testing_internal.ts#L205
*/

export interface GuinessCompatibleSpy extends jasmine.Spy {
  /* By chaining the spy with and.returnValue, all calls to the function will return a specific
   * value. */
  andReturn(val: any): void;
  /* By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied
   * function. */
  andCallFake(fn: Function): GuinessCompatibleSpy;
  /* removes all recorded calls */
  reset();
}

export class SpyObject {
  constructor(type: any) {
    for (const prop in type.prototype) {
      if (type.prototype.hasOwnProperty(prop)) {
        let m = null;
        try {
          m = type.prototype[prop];
        } catch (e) {
          // As we are creating spys for abstract classes,
          // these classes might have getters that throw when they are accessed.
          // As we are only auto creating spys for methods, this
          // should not matter.
        }
        if (typeof m === 'function') {
          this.spy(prop);
        }
      }
    }
  }

  spy(name) {
    if (!this[name]) {
      this[name] = this._createGuinnessCompatibleSpy(name);
    }
    return this[name];
  }

  /** @internal */
  _createGuinnessCompatibleSpy(name): GuinessCompatibleSpy {
    const newSpy: GuinessCompatibleSpy = jasmine.createSpy(name) as any;
    newSpy.andCallFake = newSpy.and.callFake as any;
    newSpy.andReturn = newSpy.and.returnValue as any;
    newSpy.reset = newSpy.calls.reset as any;
    // revisit return null here (previously needed for rtts_assert).
    newSpy.and.returnValue(null);
    return newSpy;
  }
}
