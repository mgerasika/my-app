import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {
  Props,
  AngularComponent,
  IAction,
  reducer,
  getStoreNameFromUniqueActionName,
  ReducerBase,
  reducerManager,
  dispatch
} from '../core/core';
import {TestActions} from './demo/action';
import {globalInitialStore, TestReducer} from './demo/reducer';
import * as assert from 'assert';

class IProps {
  x = 0;
  y = 0;
  z = 0;
}

console.log(Object.keys(IProps));

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css'],
  // tslint:disable-next-line:no-inputs-metadata-property
  inputs: ['x', 'y', 'z'],
})
export class PointComponent extends AngularComponent<IProps> implements OnInit {
  ngOnInit() {
    reducerManager.init(globalInitialStore);
    reducerManager.add(new TestReducer());
  }

  @Props()
  public get props(): IProps {
    return this as any as IProps;
  }

  public onSumClick() {
    dispatch(actions.test.sum({x: 1, y: 2}));
  }

  public onLoginClick() {
    dispatch(actions.test.login({login: 'login', password: 'zxc123=-'}));
  }

  public onLogoutClick() {
    dispatch(actions.test.logout());
  }
}

const actions = {
  test: new TestActions()
};

