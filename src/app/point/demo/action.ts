import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {action, ActionBase, IBaseStore, IDispatch} from '../../core/core';
import testService, {ILogin, ISum} from './service';
import {ITestStore} from './reducer';

interface ITestActionA {
  loginApi(request: ILogin): Promise<boolean>;

  logoutApi(): Promise<boolean>;

  sum(request: ISum): void;
}

interface ITestReducerA {
  loginApi(payload?: boolean): ITestStore;

  logoutApi(payload?: boolean): ITestStore;

  sum(payload?: ISum): ITestStore;
}

// code start here
export interface ITestAction {
  login(request: ILogin, payload?: boolean): Promise<any> | ITestStore;

  logout(payload?: boolean): Promise<boolean> | ITestStore;

  sum(request: ISum, payload?: ISum): void | ITestStore;
}

export class TestActions extends ActionBase implements ITestAction {
  @action()
  public login(request: ILogin, payload?: boolean): Promise<any> {
    this.dispatchRequest();
    return testService.requestLogin(request)
      .then((data) => this.dispatchSuccess(data))
      .catch((err) => this.dispatchFailed(err));
  }

  @action()
  public logout(): Promise<any> {
    this.dispatchRequest();
    return testService.requestLogout()
      .then((data) => this.dispatchSuccess(data))
      .catch((err) => this.dispatchFailed(err));
  }

  @action()
  public sum(request: ISum, payload?: ISum): void {
    this.dispatch(request);
  }

  public getStoreName() {
    return 'test';
  }
}

