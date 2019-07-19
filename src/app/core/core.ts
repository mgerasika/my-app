import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';

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

export function action() {
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function() {
      const key = propertyKey;

      return (dispatcher) => {
        const obj = new target.constructor();
        obj.currentActionName = key;
        obj.currentDispatcher = dispatcher;
        var args = arguments;
        return originalMethod.apply(obj, args);
      };
    };
    return descriptor;
  };
}


export interface IBaseStore {
  loading: boolean;
  error: boolean;
}

export abstract class ActionBase {
  public currentActionName: string;
  public currentDispatcher: IDispatch;

  public dispatchFailed(error) {
    this.dispatch({
      name: this.createFullName('failed'),
      payload: this.createFullName(this.currentActionName)
    });
  }

  public abstract getStoreName();

  public dispatchRequest() {
    this.dispatch({
      name: this.createFullName('request'),
      payload: this.createFullName(this.currentActionName)
    });
  }

  public dispatchSuccess(args: any) {
    this.dispatch({
      name: this.createFullName('success'),
      payload: this.createFullName(this.currentActionName)
    });

    this.dispatch({
      name: this.createFullName(this.currentActionName),
      payload: args
    });
  }

  protected createFullName(name): string {
    const res = `[${this.getStoreName().toUpperCase()}-${name}]`;
    return res;
  }

  protected dispatch(payload: any) {
    const data = {
      name: this.createFullName(this.currentActionName),
      payload: payload
    };
    this.currentDispatcher(data);
  }
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

  public getReducerFunctions() {
    return null;
  }
}



