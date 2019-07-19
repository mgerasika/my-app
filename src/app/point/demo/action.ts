import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {action, ActionBase, IBaseStore, IDispatch} from '../../core/core';
import testService, {ILogin, ISum} from './service';
import {ITestStore} from './reducer';

interface ITestActionA {
  loginApi(request: ILogin): Promise<boolean>;

  logoutApi(): Promise<boolean>;

  sum(request: ISum): IDispatch;
}

interface ITestReducerA {
  loginApi(payload?: boolean): ITestStore;

  logoutApi(payload?: boolean): ITestStore;

  sum(payload?: ISum): ITestStore;
}

export interface ITestAction {
  loginApi(request: ILogin, payload?: boolean): IDispatch | ITestStore;

  logoutApi(payload?: boolean): Promise<boolean> | ITestStore;

  sumAction(request: ISum, payload?: ISum): IDispatch | ITestStore;
}

export class TestAction extends ActionBase implements ITestAction {
  constructor() {
    super();
  }

  @action()
  public loginApi(request: ILogin, payload?: boolean): IDispatch {
    return (dispatch: IDispatch) => {
      dispatch(this.request());
      return testService.
        requestLogin(request).
        then(data => dispatch(this.success(data))).
        catch(error => dispatch(this.failed));
    };
  }

  @action()
  public logoutApi(): Promise<any> {
    this.request();
    return testService.requestLogout().then(this.success).catch(this.failed);
  }

  @action()
  public sumAction(request: ISum, payload?: ISum): IDispatch {
    return this.dispatch(request);
  }

  public getStoreName() {
    return 'test';
  }
}

export const loginApiAction = (email: string, password: string) => (dispatch: Dispatch) => {
  dispatch(loginActions.request({loading: true}));
  dispatch(loaderActions.showLoader());

  return loginApi
    .login(email, password)
    .then(response => {
      dispatch(loaderActions.hideLoader());
      return dispatch(loginActions.success(response.data));
    })
    .catch((error: IError) => {
      dispatch(loaderActions.hideLoader());
      dispatch(loginActions.failure(error));
      return Promise.reject(error);
    });
};

