import { Event, Store, Domain } from "effector"

type InitFieldValue<Value> = () => Value

export type ValidationEvent = "submit" | "blur" | "change"

export type ValidationResult = {
  isValid: boolean
  errorText?: string
}

export type Validator<Value, Form = any> = (
  value: Value,
  form?: Form
) => boolean | ValidationResult

export type ValidationError<Value = any> = {
  rule: string
  value: Value
  errorText?: string
}

export type Rule<Value, Form = any> = {
  name: string
  validator: Validator<Value, Form>
}

export type Field<Value> = {
  name: string
  $value: Store<Value>
  $errors: Store<ValidationError<Value>[]>
  $firstError: Store<ValidationError<Value> | null>
  $isValid: Store<boolean>
  onChange: Event<Value>
  changed: Event<Value>
  onBlur: Event<void>
  addError: Event<{ rule: string; errorText?: string }>
  validate: Event<void>
  reset: Event<void>
  set: Event<Value>
  resetErrors: Event<void>
  filter?: Store<boolean> | FilterFunc<Value>
}

type FilterFunc<Value> = (value: Value) => boolean

export type FieldConfig<Value> = {
  init: Value | InitFieldValue<Value>
  rules?: Rule<Value>[]
  filter?: Store<boolean> | FilterFunc<Value>
  validateOn?: ValidationEvent[]
}

export type AnyFields ={
  [key: string]: Field<any>
}

export type AnyFieldsConfigs = {
  [key: string]: FieldConfig<any>
}

export type AnyFormValues = {
  [key: string]: any
}

export type FormConfig<Fields extends AnyFieldsConfigs> = {
  fields: Fields
  domain?: Domain
  filter?: Store<boolean>
  validateOn?: ValidationEvent[]
}
