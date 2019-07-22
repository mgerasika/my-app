import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {action, ActionBase} from '../lib/action';
import {nameof} from '../lib/utils';
import {IGlobalStore, ITestStore} from './store';
import {ILogin, ISum} from './model';
import testService from './service';

export interface ITestAction {
  login(request: ILogin, payload?: string): Promise<string> | ITestStore;

  logout(request: void, payload?: string): Promise<string> | ITestStore;

  sum(request: ISum, payload?: ISum): void | ITestStore;
}

class TestActions extends ActionBase implements ITestAction {
  @action()
  public login(request: ILogin): Promise<string> {
    this.dispatchRequest();
    return testService.requestLogin(request)
      .then((data) => {
        this.dispatchSuccess(data);
        return Promise.resolve('');
      })
      .catch((ex) => {
        return Promise.reject(ex.toLocaleString());
      });
  }

  @action()
  public logout(): Promise<string> {
    this.dispatchRequest();
    return testService.requestLogout()
      .then((data) => {
        this.dispatchSuccess(data);
        return Promise.resolve('');
      })
      .catch((ex) => {
        return Promise.reject(ex.toLocaleString());
      });
  }

  @action()
  public sum(request: ISum): void {
    this.dispatch(request);
  }

  public getStoreName() {
    return nameof<IGlobalStore>('test');
  }
}

export const actions = {
  test: new TestActions()
};
