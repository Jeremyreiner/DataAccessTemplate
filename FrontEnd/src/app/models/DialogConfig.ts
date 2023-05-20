import {ComponentType} from '@angular/cdk/overlay';

export class DialogConfig {
  component: ComponentType<any>;
  data: any = null;
  afterClosed?: (result) => void;
  width: number; // pixel width amount
  constructor(component?: ComponentType<any>, data?: any, afterClosed?: (result) => void, width?: number) {
    this.component = component;
    this.data = data;
    this.afterClosed = afterClosed;
    this.width = width;
  }
}
