import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {Props, AngularComponent, IAction} from '../core/core';
import {TestActions} from './demo/action';

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
  }

  @Props()
  public get props(): IProps {
    return this as any as IProps;
  }

  onSum() {
    const testActions = new TestActions();

    dispatch(testActions.login({login: 'login', password: 'zxc123=-'}));
    dispatch(testActions.logout());
    dispatch(testActions.sum({x: 1, y: 2}));
  }
}

const dispatch = (fn: any) => {
  fn((data: IAction) => {
    console.log(`action=${data.name}  payload=${JSON.stringify(data.payload)}`);

    setTimeout(() => {
      reducerManager.dispatch(data);
    }, 1000);
  });
};

class ReducerManager {
  public dispatch(data: IAction) {

  }
}

const reducerManager = new ReducerManager();

