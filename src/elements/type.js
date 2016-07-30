/* @flow */

export interface IElement {
  initValue: any;
  getValue (): any;
  checkModified (): boolean;

  _vm: Component;
}
