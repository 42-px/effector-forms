import { Event, Store, Domain } from "effector"

type InitFieldValue<Value> = () => Value

/**
 * Trigger that will be used to validate the form or field
 */
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

export type FieldUnitShape<Value> = {
  value: Store<Value>
  initValue: Store<Value>
  isValid: Store<boolean>
  isDirty: Store<boolean>
  touched: Store<boolean>
  errors: Store<ValidationError<Value>[]>
  firstError: Store<ValidationError<Value> | null>
  errorText: Store<string>
  onChange: Event<Value>
  onBlur: Event<void>
  addError: Event<{ rule: string; errorText?: string }>
  validate: Event<void>
  reset: Event<void>
  resetErrors: Event<void>
  resetValue: Event<void>
}

export type Field<Value> = {
  name: string
  $initValue: Store<Value>
  $value: Store<Value>
  $errors: Store<ValidationError<Value>[]>
  $firstError: Store<ValidationError<Value> | null>
  $errorText: Store<string>
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
  "@@unitShape": () => FieldUnitShape<Value>
}

type FilterFunc<Value> = (value: Value) => boolean

export type RuleResolver<
  Value = any,
  Form = any
> = (value: Value, form: Form) => Rule<Value, Form, void>[]


/**
 * field configuration object
 */
export type FieldConfig<Value> = {
  /**
   * initial value. The type of this value is used to
   * infer the type of the field. You can pass a function
   * that returns an initial value. This function will be called
   * once when the form is created
   */
  init: Value | InitFieldValue<Value>
  rules?: Rule<Value>[] | RuleResolver<Value, any>
  filter?: Store<boolean> | FilterFunc<Value>
  validateOn?: ValidationEvent[]
  units?: {
    $value?: Store<Value>
    $errors?: Store<ValidationError<Value>[]>
    $isTouched?: Store<boolean>
    $initValue?: Store<Value>
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

/**
 * KV containing form values
 */
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

export type AddErrorPayload = {
  field: string
  rule: string
  errorText?: string
}

/**
 * External units KV. By default,
 * each form unit is created when the {@link createForm | factory} is
 * called. If you pass a unit here, it will be used
 * instead of creating a new unit
 */
export type ExternalFormUnits<Values extends AnyFormValues> = {
  submit?: Event<void>
  validate?: Event<void>
  addErrors?: Event<AddErrorPayload[]>
  reset?: Event<void>
  resetValues?: Event<void>
  resetTouched?: Event<void>
  resetErrors?: Event<void>
  formValidated?: Event<Values>
  setInitialForm?: Event<Partial<AnyFormValues>>
  setForm?: Event<Partial<AnyFormValues>>
}


/**
 * The object that is passed to the {@link createForm | createForm} factory
 */
export type FormConfig<Values extends AnyFormValues> = {
  /**
   * The keys of the object are the names of the fields,
   * and the values are the {@link FieldConfig | FieldConfig}
   */
  fields: FormFieldConfigs<Values>
  /**
   * If you pass a domain into this field,
   * all units of the form will be in this domain
   */
  domain?: Domain
  /**
   * If store is passed the `formValidated` event will be called
   * then the value of store will be true
   */
  filter?: Store<boolean>
  /**
   * Trigger that will be used to validate the form.
   */
  validateOn?: ValidationEvent[]
  /**
   * External units KV. 
   */
  units?: ExternalFormUnits<Values>
}

export type FormUnitShape<Values extends AnyFormValues> = {
  isValid: Store<boolean>
  isDirty: Store<boolean>
  touched: Store<boolean>
  submit: Event<void>
  validate: Event<void>
  reset: Event<void>
  addErrors: Event<AddErrorPayload[]>
  setForm: Event<Partial<Values>>
  setInitialForm: Event<Partial<Values>>
  resetTouched: Event<void>
  resetValues: Event<void>
  resetErrors: Event<void>
  formValidated: Event<Values>
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
  addErrors: Event<AddErrorPayload[]>
  set: Event<Partial<Values>>
  setForm: Event<Partial<Values>>
  setInitialForm: Event<Partial<Values>>
  resetTouched: Event<void>
  resetValues: Event<void>
  resetErrors: Event<void>
  formValidated: Event<Values>
  "@@unitShape": () => FormUnitShape<Values>
}

