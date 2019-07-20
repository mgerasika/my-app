import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError, debounce} from 'rxjs/operators';
import 'reflect-metadata';
import {IGlobalStore} from '../point/demo/reducer';

// tslint:disable-next-line
export const __decorate = function(decorators, target, key, desc) {
  if (
    typeof Reflect === 'object' &&
    typeof (Reflect as any).decorate === 'function'
  ) {
    return (Reflect as any).decorate(decorators, target, key, desc);
  }
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight((o, d) => {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight((o, d) => {
        return d && d(target, key), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight((o, d) => {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};

// tslint:disable
export function Props(): any {
  return (componentProptotype: any, _zy: any, _zz: any) => {
    __decorate([Input('x')], componentProptotype, 'x', void 0);
    __decorate([Input('y')], componentProptotype, 'y', void 0);
    __decorate([Input('z')], componentProptotype, 'z', void 0);
  };
};

export abstract class AngularComponent<T> {
  @Props()
  public get props(): T {
    return this as any as T;
  }
}

export interface IAction {
  name: string;
  payload: any;
}

export declare type IDispatch = (dispatcher: any) => void

export const assert = (exp: boolean, msg: string) => {
  if (!exp) {
    alert(msg);
  }
};

export function action() {
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('design:name', propertyKey, descriptor.value);
    Reflect.defineMetadata('design:decorator:action', true, descriptor.value);

    const baseClass = Object.getPrototypeOf(target);
    assert(baseClass.constructor === ActionBase, 'invalid usage');
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      return (dispatcher) => {
        const actionInstance = Reflect.construct(target.constructor, []);
        actionInstance.init(propertyKey, dispatcher);
        return originalMethod.apply(actionInstance, arguments);
      };
    };
    return descriptor;
  };
}

export const nameof = <T>(name: keyof T) => name;

export function reducer() {
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('design:name', propertyKey, descriptor.value);
    Reflect.defineMetadata('design:decorator:reducer', true, descriptor.value);
    return descriptor;
  };
}

export interface IBaseStore {
  loading: boolean;
  error: string;
}

export const baseInitialStore: IBaseStore = {
  loading: false,
  error: ''
};

export abstract class ActionBase {
  private executingActionName: string;
  private reduxDispatcher: IDispatch;

  public init(actionName: string, reduxDispatcher: IDispatch) {
    this.executingActionName = actionName;
    this.reduxDispatcher = reduxDispatcher;
  }

  public dispatchFailed(error) {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName + ':failed'),
      payload: error,
    });
  }

  public abstract getStoreName();

  public dispatchRequest() {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName + ':request'),
      payload: ''
    });
  }

  public dispatchSuccess(args: any) {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName + ':success'),
      payload: args
    });
  }

  protected dispatch(payload: any) {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName),
      payload: payload
    });
  }
}

const UNIQUE_STORE_SEPARATOR = '-';
const createUniqueActionName = (storeName, actionName): string => {
  return `${storeName}${UNIQUE_STORE_SEPARATOR}${actionName}`;
};

export const getStoreNameFromUniqueActionName = (uniqueActionName): string => {
  const [storeName] = uniqueActionName.split(UNIQUE_STORE_SEPARATOR);
  return storeName;
};

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
    const proto = this['__proto__'];
    const keys = Object.getOwnPropertyNames(proto);
    const newKeys = keys.filter(key => {
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

export const dispatch = (fn: any) => {
  fn((action: IAction) => {
    console.log(`action=${action.name}  payload=${JSON.stringify(action.payload)}`);
    reducerManager.modifyStore(action);
  });
};

class ReducerManager {
  private reducers: any = {};
  private store: object;

  public init(store: object) {
    this.store = store;
  }

  public add(reducer: ReducerBase<any>) {
    this.reducers[reducer.getStoreName()] = reducer.getReducers();
  }

  public modifyStore(data: IAction) {
    const storeName = getStoreNameFromUniqueActionName(data.name);
    const reducerFn = this.reducers[storeName][data.name];
    assert(reducerFn, `Reducer not found ${data.name}`);
    this.store[storeName] = reducerFn(this.store[storeName], data.payload);
    console.log(`Store updated = ${JSON.stringify(this.store)}`);
  }
}

export const reducerManager = new ReducerManager();



