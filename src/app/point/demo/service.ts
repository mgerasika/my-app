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
    return Promise.resolve('login success from server');
  }

  requestLogout(): Promise<string> {
    return Promise.resolve('logout succcess from server');
  }
}

const testService = new TestService();
export default testService;
