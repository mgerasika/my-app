import {IBaseStore} from '../../core/core';

export interface ILogin {
  login: string;
  password: string;
}

export interface ISum {
  x: number;
  y: number;
}

export class TestService {
  requestLogin(request: ILogin): Promise<string> {
    return new Promise<string>(resolve => {
      setTimeout(() => {
        resolve('login success from server');
      }, 1000);
    });
  }

  requestLogout(): Promise<string> {
    return new Promise<string>(resolve => {
      setTimeout(() => {
        resolve('logout success from server');
      }, 1000);
    });
  }
}

const testService = new TestService();
export default testService;
