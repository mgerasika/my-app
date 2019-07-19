import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {IBaseStore, ReducerBase} from '../../core/core';
import {ILogin, ISum} from './service';
import {ITestAction, TestActions} from './action';

export interface ITestStore extends IBaseStore {
  result: number;
}

class TestReducer extends ReducerBase<ITestStore> implements ITestAction {
  public getStoreName() {
    return new TestActions().getStoreName();
  }

  public login(request: ILogin, payload: boolean): ITestStore {
    return {
      ...this.store,
    };
  }

  public logout(payload: boolean): ITestStore {
    return {
      ...this.store,
    };
  }

  public sum(payload: ISum): ITestStore {
    return {
      ...this.store,
      result: payload.x + payload.y
    };
  }
}



