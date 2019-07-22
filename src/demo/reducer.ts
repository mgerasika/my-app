import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {ITestAction} from './action';
import {init} from 'protractor/built/launcher';
import {reducer, ReducerBase} from '../lib/reducer';
import {baseInitialStore, IBaseStore} from '../lib/store';
import {nameof} from '../lib/utils';
import {IGlobalStore, ITestStore} from './store';
import {ILogin, ISum} from './model';

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



