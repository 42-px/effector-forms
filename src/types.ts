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
  onChange: Event<Value>
  onBlur: Event<void>
}

export type FieldConfig<Value> = {
  init: Value | InitFieldValue<Value>
  rules?: Rule<Value>[]
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
