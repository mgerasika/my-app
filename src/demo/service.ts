import {ILogin} from './model';

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
