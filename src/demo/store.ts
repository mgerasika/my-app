import {Component, OnInit, Input} from '@angular/core';
import {keys} from 'ts-transformer-keys';
import {catchError} from 'rxjs/operators';
import {ITestAction} from './action';
import {init} from 'protractor/built/launcher';
import {reducer, ReducerBase} from '../lib/reducer';
import {baseInitialStore, IBaseStore} from '../lib/store';
import {nameof} from '../lib/utils';

export interface ITestStore extends IBaseStore {
  result: number;
  message: string;
}

export const initialTestStore: ITestStore = {
  ...baseInitialStore,
  result: 0,
  message: ''
};

export interface IGlobalStore {
  test: ITestStore;
}

export const globalInitialStore: IGlobalStore = {
  test: initialTestStore
};



