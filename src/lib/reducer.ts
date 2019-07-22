import {assert, createUniqueActionName, getStoreNameFromUniqueActionName} from './utils';
import {IAction} from './action';
import {EventEmitter} from '@angular/core';
import {IBaseStore} from './store';

export function reducer() {
  // tslint:disable-next-line:only-arrow-functions
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    // @ts-ignore
    Reflect.defineMetadata('design:name', propertyKey, descriptor.value);
    // @ts-ignore
    Reflect.defineMetadata('design:decorator:reducer', true, descriptor.value);
    return descriptor;
  };
}

export abstract class ReducerBase<T> {
  public store: T;

  public abstract getStoreName();

  public request(): T {
    return {
      ...this.store,
      loading: true,
    };
  }

  public success(payload: any) {
    return {
      ...this.store,
      loading: false,
    };
  }

  public failed(error: string) {
    return {
      ...this.store,
      loading: false,
      error: error
    };
  }

  public getReducers() {
    const proto = this[`__proto__`];
    const keys = Object.getOwnPropertyNames(proto);
    const newKeys = keys.filter(key => {
      // @ts-ignore
      const hasDecorator = Reflect.getMetadata('design:decorator:reducer', this[key]);
      return hasDecorator;
    });

    const result = newKeys.reduce((accum: {}, methodName) => {
      accum[createUniqueActionName(this.getStoreName(), methodName)] = (store, payload) => {
        const reducerBase = Reflect.construct(proto.constructor, []) as ReducerBase<any>;
        reducerBase.store = store;
        return reducerBase[methodName](null, payload);
      };

      accum[createUniqueActionName(this.getStoreName(), `${methodName}:request`)] = (store, payload) => {
        const reducerBase = Reflect.construct(proto.constructor, []) as ReducerBase<any>;
        reducerBase.store = store;
        return reducerBase.request();
      };

      accum[createUniqueActionName(this.getStoreName(), `${methodName}:success`)] = (store, payload) => {
        const reducerBase = Reflect.construct(proto.constructor, []) as ReducerBase<any>;
        reducerBase.store = store;
        const newStore = reducerBase.success(payload);

        reducerBase.store = newStore;
        return reducerBase[methodName](null, payload);
      };

      accum[createUniqueActionName(this.getStoreName(), `${methodName}:failed`)] = (store, payload) => {
        const reducerBase = Reflect.construct(proto.constructor, []) as ReducerBase<any>;
        reducerBase.store = store;
        return reducerBase.failed(payload);
      };
      return accum;
    }, {});
    return result;
  }
}

class ReducerManager {
  private reducers: any = {};

  public add(r: ReducerBase<any>) {
    this.reducers[r.getStoreName()] = r.getReducers();
  }

  public findReducer(data: IAction) {
    const storeName = getStoreNameFromUniqueActionName(data.name);
    const reducerFn = this.reducers[storeName][data.name];
    assert(reducerFn, `Reducer not found ${data.name}`);
    return reducerFn;
  }
}

export const reducerManager = new ReducerManager();
