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
  requestLogin(request: ILogin): Promise<any> {
    return Promise.resolve();
  }

  requestLogout(): Promise<string> {
    return Promise.resolve('hi');
  }
}

const testService = new TestService();
export default testService;
