import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {action, ActionBase, IBaseStore, IDispatch, nameof} from '../../core/core';
import testService, {ILogin, ISum} from './service';
import {IGlobalStore, ITestStore} from './reducer';

interface ITestActionA {
  loginApi(request: ILogin): Promise<boolean>;

  logoutApi(request: void): Promise<boolean>;

  sum(request: ISum): void;
}

interface ITestReducerA {
  loginApi(payload?: boolean): ITestStore;

  logoutApi(payload?: boolean): ITestStore;

  sum(payload?: ISum): ITestStore;
}

export interface ITestAction {
  login(request: ILogin, payload?: string): Promise<string> | ITestStore;

  logout(request: void, payload: string): Promise<string> | ITestStore;

  sum(request: ISum, payload?: ISum): void | ITestStore;
}

export class TestActions extends ActionBase implements ITestAction {
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
  public sum(request: ISum, payload?: ISum): void {
    this.dispatch(request);
  }

  public getStoreName() {
    return nameof<IGlobalStore>('test');
  }
}

