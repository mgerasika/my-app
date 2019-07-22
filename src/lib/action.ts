import {assert, createUniqueActionName} from './utils';
import {reducerManager} from './reducer';
import {storeManager} from './store';

// decorator
export function action() {
  // tslint:disable-next-line:only-arrow-functions
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    // @ts-ignore
    Reflect.defineMetadata('design:name', propertyKey, descriptor.value);
    // @ts-ignore
    Reflect.defineMetadata('design:decorator:action', true, descriptor.value);

    const baseClass = Object.getPrototypeOf(target);
    assert(baseClass.constructor === ActionBase, 'invalid usage');
    const originalMethod = descriptor.value;
    // tslint:disable-next-line:only-arrow-functions
    descriptor.value = function() {
      return (dispatcher) => {
        const actionInstance = Reflect.construct(target.constructor, []);
        actionInstance.init(propertyKey, dispatcher);
        return originalMethod.apply(actionInstance, arguments);
      };
    };
    return descriptor;
  };
}

export interface IAction {
  name: string;
  payload: any;
}

export abstract class ActionBase {
  private executingActionName: string;
  private reduxDispatcher: IDispatch;

  public init(actionName: string, reduxDispatcher: IDispatch) {
    this.executingActionName = actionName;
    this.reduxDispatcher = reduxDispatcher;
  }

  public dispatchFailed(error) {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName + ':failed'),
      payload: error,
    });
  }

  public abstract getStoreName();

  public dispatchRequest() {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName + ':request'),
      payload: ''
    });
  }

  public dispatchSuccess(args: any) {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName + ':success'),
      payload: args
    });
  }

  protected dispatch(payload: any) {
    this.reduxDispatcher({
      name: createUniqueActionName(this.getStoreName(), this.executingActionName),
      payload
    });
  }
}

export declare type IDispatch = (dispatcher: any) => void;

export const dispatch = (data: any) => {
  data((fnAction: IAction) => {
    console.log(`action=${fnAction.name}  payload=${JSON.stringify(fnAction.payload)}`);
    storeManager.modifyStore(fnAction);
  });
};
