declare type ValidatorDefinition = {
  check: Function, // validator function
  message?: string | Function // error message
}

declare type ValidatorAsset = Function | ValidatorDefinition

declare type ValidationError = {
  field: string,
  validator: string,
  message?: string
}

declare type ValidationResult = {
  valid: boolean,
  invalid: boolean,
  dirty: boolean,
  pristine: boolean,
  touched: boolean,
  untouched: boolean,
  modified: boolean,
  // `errors` or validator result
  [key: string]: Array<ValidationError> | boolean | string
}

declare type ValidatorProgresses = {
  [key: string]: string
}

declare type $ValidationRawResult = {
  [key: string]: boolean | string | void
}

declare type $ValidateDescriptor = {
  fn: Function,
  value: any,
  field: string,
  rule?: any,
  msg?: string | Function
}

declare type ValidityComponent = {
  field: string,
  child: any,
  validators: string | Array<string> | Object,
  valid: boolean,
  invalid: boolean,
  dirty: boolean,
  pristine: boolean,
  touched: boolean,
  untouched: boolean,
  modified: boolean,
  result: ValidatorAsset,
  progresses: ValidatorProgresses,

  checkModified (): boolean,
  willUpdateTouched (options?: any): void,
  willUpdateDirty (): void,
  willUpdateModified (): void,
  handleInputable (e: Event): void,
  watchInputable (val: any): void,
  reset (): void,
  validate (..args: Array<any>): boolean,
} & Component

declare interface ValidityElement {
  initValue: any,
  getValue (): any,
  checkModified (): boolean,
  listenToucheableEvent (): void,
  unlistenToucheableEvent (): void,
  listenInputableEvent (): void,
  unlistenInputableEvent (): void
}
