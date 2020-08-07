export type ValidationEvent = "submit" | "blur" | "change"

type ValidationResult = {
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
