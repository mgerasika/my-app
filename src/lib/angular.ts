// tslint:disable
import {EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {__decorate} from './utils';

//Props decorator
export function Props(): any {
  return (componentProptotype: any, _zy: any, _zz: any) => {
    //TODO replace to reflection in future
    __decorate([Input('x')], componentProptotype, 'x', void 0);
    __decorate([Input('y')], componentProptotype, 'y', void 0);
    __decorate([Input('result')], componentProptotype, 'result', void 0);
    __decorate([Input('message')], componentProptotype, 'message', void 0);
  };
};

export abstract class AngularComponent<T> implements OnInit, OnDestroy,OnChanges {
  public init$: EventEmitter<AngularComponent<T>> = new EventEmitter();
  public destroy$: EventEmitter<AngularComponent<T>> = new EventEmitter();

  public abstract get props(): T;

  public connect(component:AngularComponent<T>) {
  }

  public constructor(){
    this.connect(this);
  }

  ngOnDestroy(): void {
    this.destroy$.emit(this);
  }

  ngOnInit(): void {
    this.init$.emit(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
