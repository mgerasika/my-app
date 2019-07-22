import {AngularComponent} from './angular';
import {IGlobalStore} from '../demo/store';
import {IBaseStore, storeManager} from './store';
import {reduce} from 'rxjs/operators';
import {reducerManager} from './reducer';

declare type ConnectHandlerBase = (state: any) => Partial<any>;
export const connect = (type: any, mapStateToProps: ConnectHandlerBase, mapDispatchToProps: ConnectHandlerBase) => {
  type.prototype.connect = (component: AngularComponent<any>) => {

    const dispatchers = mapDispatchToProps ? mapDispatchToProps({}) : {};
    Object.keys(dispatchers).forEach((key: string) => {
      // TODO investigate - probaldy broken context into foreach
      // component[`__proto__`][key] = dispatchers[key];
      component[key] = dispatchers[key];
    });

    storeManager.storeChagned$.subscribe((store: IGlobalStore) => {
      const newProps = {
        ...component.props,
        ...mapStateToProps ? mapStateToProps(store) : {},
      };
      const keys = Object.keys(newProps);
      keys.forEach((key: string) => {
        component[key] = newProps[key];
      });
      // TODO add logic to compare previous and new props and call ngOnChanges
      const changeObject = {};
      component.ngOnChanges(changeObject);
    });
  };
};




