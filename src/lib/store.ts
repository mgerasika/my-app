import {EventEmitter} from '@angular/core';
import {IAction} from './action';
import {assert, getStoreNameFromUniqueActionName} from './utils';
import {IGlobalStore} from '../demo/store';
import {ReducerBase, reducerManager} from './reducer';

export interface IBaseStore {
  loading: boolean;
  error: string;
}

export const baseInitialStore: IBaseStore = {
  loading: false,
  error: ''
};

class StoreManager<T> {
  private store: T;
  public storeChagned$: EventEmitter<T> = new EventEmitter();

  public init(store: T) {
    this.store = store;
  }

  public modifyStore(data: IAction) {
    const storeName = getStoreNameFromUniqueActionName(data.name);
    const reducerFn = reducerManager.findReducer(data);
    this.store[storeName] = reducerFn(this.store[storeName], data.payload);
    console.log(`Store updated = ${JSON.stringify(this.store)}`);

    this.storeChagned$.emit(this.store);
  }
}

export const storeManager = new StoreManager<IGlobalStore>();
