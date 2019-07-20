import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {baseInitialStore, IBaseStore, nameof, reducer, ReducerBase} from '../../core/core';
import {ILogin, ISum} from './service';
import {ITestAction, TestActions} from './action';
import {init} from 'protractor/built/launcher';

export interface ITestStore extends IBaseStore {
  result: number;
  message: string;
}

export const initialTestStore: ITestStore = {
  ...baseInitialStore,
  result: 0,
  message: ''
};

export interface IGlobalStore {
  test: ITestStore;
}

export const globalInitialStore: IGlobalStore = {
  test: initialTestStore
};

export class TestReducer extends ReducerBase<ITestStore> implements ITestAction {
  public getStoreName() {
    return nameof<IGlobalStore>('test');
  }

  @reducer()
  public login(request: ILogin, payload: string): ITestStore {
    return {
      ...this.store,
      message: payload
    };
  }

  @reducer()
  public logout(request: void, payload: string): ITestStore {
    return {
      ...this.store,
      message: payload
    };
  }

  @reducer()
  public sum(request: ISum, payload: ISum): ITestStore {
    return {
      ...this.store,
      result: payload.x + payload.y
    };
  }
}



