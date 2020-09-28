import { Event, Store, Domain } from "effector"

type InitFieldValue<Value> = () => Value

export type ValidationEvent = "submit" | "blur" | "change"

export type ValidationResult = {
  isValid: boolean
  errorText?: string
}

export type Validator<Value, Form = any, Source = any> = (
  value: Value,
  form?: Form,
  source?: Source,
) => boolean | ValidationResult

export type ValidationError<Value = any> = {
  rule: string
  value: Value
  errorText?: string
}

export type Rule<Value, Form = any, Source = any> = {
  name: string
  errorText?: string
  source?: Store<Source>
  validator: Validator<Value, Form, Source>
}

export type Field<Value> = {
  name: string
  $value: Store<Value>
  $errors: Store<ValidationError<Value>[]>
  $firstError: Store<ValidationError<Value> | null>
  $isValid: Store<boolean>
  $isDirty: Store<boolean>
  $isTouched: Store<boolean>
  $touched: Store<boolean>
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
  units?: {
    $value?: Store<Value>
    $errors?: Store<ValidationError<Value>[]>
    $isTouched?: Store<boolean>
    onChange?: Event<Value>
    changed?: Event<Value>
    onBlur?: Event<void>
    addError?: Event<{ rule: string; errorText?: string }>
    validate?: Event<void>
    reset?: Event<void>
    resetErrors?: Event<void>
  }
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

export type FormValues<Fields extends AnyFieldsConfigs> = {
  [K in keyof Fields]: Fields[K] extends FieldConfig<infer U>
    ? U
    : never
}

export type FormConfig<Fields extends AnyFieldsConfigs> = {
  fields: Fields
  domain?: Domain
  filter?: Store<boolean>
  validateOn?: ValidationEvent[]
  units?: {
    submit?: Event<void>
    reset?: Event<void>
    resetTouched?: Event<void>
    formValidated?: Event<FormValues<Fields>>
    setForm?: Event<Partial<FormValues<Fields>>>
  }
}
