import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import * as assert from 'assert';
import {AngularComponent, Props} from '../../lib/angular';
import {globalInitialStore} from '../../demo/store';
import {TestReducer} from '../../demo/reducer';
import {reducerManager} from '../../lib/reducer';
import {dispatch} from '../../lib/action';
import {actions} from '../../demo/action';
import {connect} from '../../lib/connect';
import {ILogin, ISum} from '../../demo/model';
import {storeManager} from '../../lib/store';

class IProps {
  x = 1;
  y = 2;
  result = 0;
  message = '';
  onDoSum: (sum: ISum) => void;
  onDoLogin: (login: ILogin) => void;
  onDoLogout: () => void;
}

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css'],
  // tslint:disable-next-line:no-inputs-metadata-property
  inputs: ['x', 'y', 'result', 'message'],
})
export class PointComponent extends AngularComponent<IProps> implements OnInit {
  public constructor() {
    super();
  }

  @Props()
  public get props(): IProps {
    return this as any as IProps;
  }

  public onSumClick() {
    this.props.onDoSum({x: this.props.x, y: this.props.y});
  }

  public onLoginClick() {
    this.props.onDoLogin({login: 'login', password: 'zxc123=-'});
  }

  public onLogoutClick() {
    this.props.onDoLogout();
  }
}

const mapStateToProps = ({test}): Partial<IProps> => {
  return {
    result: test.result,
    message: test.message,
  };
};

const mapDispatchToProps = (): Partial<IProps> => {
  return {
    onDoSum: (sum: ISum) => {
      dispatch(actions.test.sum(sum));
    },
    onDoLogin: (login: ILogin) => {
      dispatch(actions.test.login(login));
    },
    onDoLogout: () => {
      dispatch(actions.test.logout());
    },
  };
};

connect(PointComponent, mapStateToProps, mapDispatchToProps);


