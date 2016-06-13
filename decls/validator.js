declare type ValidatorDefinition = {
  check: Function, // validator function
  message?: string | Function // error message
}
