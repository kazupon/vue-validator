declare type Dictionary<T> = { [key: string]: T }

declare type ValidatorConfig = {
  classes: Dictionary<string>
}

declare type ValidatorDefinition = {
  check: Function, // validator function
  message?: string | Function // error message
}

declare type ValidatorAsset = Function | ValidatorDefinition

declare type ValidationError = {
  field: string,
  validator: string,
  message?: string,
  prop?: string
}

declare type $ValidationCommonResult = {
  valid: boolean,
  invalid: boolean,
  dirty: boolean,
  pristine: boolean,
  touched: boolean,
  untouched: boolean,
  modified: boolean,
  errors?: Array<ValidationError>
}

declare type ValidationResult = Dictionary<Array<ValidationError> | boolean | string> & $ValidationCommonResult

declare type ValidatorProgresses = Dictionary<string | Dictionary<string>>

declare type $ValidationRawResult = Dictionary<boolean | string | void | Dictionary<boolean | string | void>>

declare type ValidateDescriptor = {
  fn: Function,
  name?: string,
  value: any,
  field: string,
  prop?: string,
  rule?: any,
  msg?: string | Function
}

declare type $ValidateDescriptor = {
  props?: Dictionary<Array<string>>
} & ValidateDescriptor

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
  result: ValidationResult,
  progress: string,
  progresses: ValidatorProgresses,
  multiple: boolean,
  autotouch: boolean,

  checkModified (): boolean,
  willUpdateTouched (options?: any): void,
  willUpdateDirty (): void,
  willUpdateModified (): void,
  handleInputable (e: Event): void,
  watchInputable (val: any): void,
  reset (): void,
  touch (): void,
  validate (...args: Array<any>): boolean,
} & Component

declare interface ValidityElement {
  initValue: any,
  attachValidity (): void,
  getValue (): any,
  checkModified (): boolean,
  listenToucheableEvent (): void,
  unlistenToucheableEvent (): void,
  listenInputableEvent (): void,
  unlistenInputableEvent (): void,
  fireInputableEvent (): void,
  modelValueEqual (vnode: VNode): ?boolean
}

declare type $ValidityGroupResult = Dictionary<ValidationResult>

declare type $ValidityGroupData = {
  valid: boolean,
  dirty: boolean,
  touched: boolean,
  modified: boolean,
  results: $ValidityGroupResult
}

declare type $ValidationGroupResult = Dictionary<ValidationResult> & $ValidationCommonResult

declare type ValidityGroupComponent = {
  results: $ValidityGroupResult,
  validityCount (): Number,
  register (name:string, validity: ValidityComponent | ValidityGroupComponent): void,
  unregister (name: string): void,
  isRegistered (name: string): boolean,
  getValidityKeys (): Array<string>,
  resetResults (ignore: ?string): void,
} & Component

declare interface Validationable {
  register (
    field: string,
    validity: ValidityComponent | ValidityGroupComponent,
    options: { named?: string, group?: string }
  ): void,
  unregister (
    field: string,
    options: { named?: string, group?: string }
  ): void,
  destroy (): void
}
