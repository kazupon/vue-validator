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

declare type ValidityComponent = $Validity & Component

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

declare interface $Validity {
  willUpdateTouched (options?: Object): void
}

declare interface ValidityElement {
  initValue: any,
  getValue (): any,
  checkModified (): boolean,
  listenToucheableEvent (): void,
  unlistenToucheableEvent (): void
}
