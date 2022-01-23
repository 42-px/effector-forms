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

export type FieldData<Value> = {
  value: Value
  errors: ValidationError<Value>[]
  firstError: ValidationError<Value> | null
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
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
  $field: Store<FieldData<Value>>
  onChange: Event<Value>
  changed: Event<Value>
  onBlur: Event<void>
  addError: Event<{ rule: string; errorText?: string }>
  validate: Event<void>
  reset: Event<void>
  set: Event<Value>
  resetErrors: Event<void>
  resetValue: Event<void>
  filter?: Store<boolean> | FilterFunc<Value>
}

type FilterFunc<Value> = (value: Value) => boolean

export type RuleResolver<
  Value = any,
  Form = any
> = (value: Value, form: Form) => Rule<Value, Form, void>[]

export type FieldConfig<Value> = {
  init: Value | InitFieldValue<Value>
  rules?: Rule<Value>[] | RuleResolver<Value, any>
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
    resetValue?: Event<void>
    reset?: Event<void>
    resetErrors?: Event<void>
  }
}

export type AnyFields = {
  [key: string]: Field<any>
}

export type AnyFieldsConfigs = {
  [key: string]: FieldConfig<any>
}

export type AnyFormValues = {
  [key: string]: any
}

export type FormValues<Fields extends AnyFields> = {
  [K in keyof Fields]: Fields[K] extends Field<infer U>
   ? U
   : never
}

export type FormFieldConfigs<Values extends AnyFormValues> = {
  [K in keyof Values]: FieldConfig<Values[K]>
}

export type FormFields<Values extends AnyFormValues> = {
  [K in keyof Values]: Field<Values[K]>
}


export type FormConfig<Values extends AnyFormValues> = {
  fields: FormFieldConfigs<Values>
  domain?: Domain
  filter?: Store<boolean>
  validateOn?: ValidationEvent[]
  units?: {
    submit?: Event<void>
    validate?: Event<void>
    reset?: Event<void>
    resetValues?: Event<void>
    resetTouched?: Event<void>
    resetErrors?: Event<void>
    formValidated?: Event<Values>
    setForm?: Event<Partial<AnyFormValues>>
  }
}


export type Form<Values extends AnyFormValues> = {
  fields: FormFields<Values>
  $values: Store<Values>
  $eachValid: Store<boolean>
  $isValid: Store<boolean>
  $isDirty: Store<boolean>
  $touched: Store<boolean>
  $meta: Store<{
    isValid: boolean
    isDirty: boolean
    touched: boolean
  }>
  submit: Event<void>
  validate: Event<void>
  reset: Event<void>
  set: Event<Partial<Values>>
  setForm: Event<Partial<Values>>
  resetTouched: Event<void>
  resetValues: Event<void>
  resetErrors: Event<void>
  formValidated: Event<Values>
}

