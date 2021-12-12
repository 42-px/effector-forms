import { useStore } from "effector-react"
import { Form } from "./factory"
import {
    Field,
    FormValues,
    ValidationError,
    FieldConfig,
    AnyFieldsConfigs,
    AnyFormValues
} from "./types"
import { wrapEvent } from "./ssr"

type ErrorTextMap = {
  [key: string]: string
}

type AddErrorPayload = { rule: string; errorText?: string }

type ConnectedField<Value> = {
  name: string
  value: Value
  errors: ValidationError<Value>[]
  firstError: ValidationError<Value> | null
  hasError: () => boolean
  onChange: (v: Value) => Value
  onBlur: (v: void) => void
  errorText: (map?: ErrorTextMap) => string
  addError: (p: AddErrorPayload) => AddErrorPayload
  validate: (v: void) => void
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
  touched: boolean
  reset: (v: void) => void
  set: (v: Value) => Value
  resetErrors: (v: void) => void
}

type ConnectedFields<Fields extends AnyFieldsConfigs> = {
  [K in keyof Fields]: Fields[K] extends FieldConfig<infer U>
  ? ConnectedField<U>
  : never
}

type AnyConnectedFields = {
  [key: string]: ConnectedField<any>
}

export function useField<Value>(field: Field<Value>): ConnectedField<Value> {
    const {
        value,
        errors,
        firstError,
        isValid,
        isDirty,
        isTouched: touched,
    } = useStore(field.$field)

    return {
        name: field.name,
        value,
        errors,
        firstError,
        isValid,
        isDirty,
        touched,
        isTouched: touched,
        onChange: wrapEvent(field.onChange),
        onBlur: wrapEvent(field.onBlur),
        addError: wrapEvent(field.addError),
        validate: wrapEvent(field.validate),
        reset: wrapEvent(field.reset),
        set: wrapEvent(field.onChange),
        resetErrors: wrapEvent(field.resetErrors),
        hasError: () => {
            return firstError !== null
        },
        errorText: (map) => {
            if (!firstError) {
                return ""
            }
            if (!map) {
                return firstError.errorText || ""
            }
            if (map[firstError.rule]) {
                return map[firstError.rule]
            }
            return firstError.errorText || ""
        }
    }

}

type Result<Fields extends AnyFieldsConfigs> = {
  fields: ConnectedFields<Fields>
  values: FormValues<Fields>
  hasError: (fieldName?: keyof Fields) => boolean
  eachValid: boolean
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
  touched: boolean
  errors: (fieldName: keyof Fields) => (
    // eslint-disable-next-line max-len
    Fields[typeof fieldName] extends FieldConfig<infer U> ? ValidationError<U>[] : never
  )
  error: (fieldName: keyof Fields) => (
    // eslint-disable-next-line max-len
    Fields[typeof fieldName] extends FieldConfig<infer U> ? ValidationError<U> : never
  ) | null
  errorText: (fieldName: keyof Fields, map?: ErrorTextMap) => string
  submit: (p: void) => void
  reset: (p: void) => void
  setForm: (p: Partial<FormValues<Fields>>) => Partial<FormValues<Fields>>
  set: (p: Partial<FormValues<Fields>>) => Partial<FormValues<Fields>>
  formValidated: (p: FormValues<Fields>) => FormValues<Fields>
}

export function useForm<Fields extends AnyFieldsConfigs>(
    form: Form<Fields>
): Result<Fields> {
    const connectedFields = {} as AnyConnectedFields
    const values = {} as AnyFormValues

    for (const fieldName in form.fields) {
        if (!form.fields.hasOwnProperty(fieldName)) continue 
        const field = form.fields[fieldName]
        const connectedField = useField(field)
        connectedFields[fieldName] = connectedField
        values[fieldName] = connectedField.value
    }

    const {
        isValid: eachValid,
        isDirty,
        touched,
    } = useStore(form.$meta)


    const hasError = (fieldName?: string): boolean => {
        if (!fieldName) {
            return !eachValid
        }
        if (connectedFields[fieldName]) {
            return Boolean(connectedFields[fieldName].firstError)
        }
        return false
    }

    const error = (fieldName: string) => {
        if (connectedFields[fieldName]) {
            return connectedFields[fieldName].firstError
        }
        return null
    }

    const errors = (fieldName: string) => {
        if (connectedFields[fieldName]) {
            return connectedFields[fieldName].errors
        }
        return []
    }

    const errorText = (fieldName: string, map?: ErrorTextMap) => {
        const field = connectedFields[fieldName]
        if (!field) {
            return ""
        }
        if (!field.firstError) {
            return ""
        }
        if (!map) {
            return field.firstError.errorText || ""
        }
        if (map[field.firstError.rule]) {
            return map[field.firstError.rule]
        }
        return field.firstError.errorText || ""
    }

    return {
        fields: connectedFields as ConnectedFields<Fields>,
        values,
        hasError,
        eachValid,
        isValid: eachValid,
        isDirty,
        isTouched: touched,
        touched,
        errors,
        error,
        reset: wrapEvent(form.reset),
        errorText,
        submit: wrapEvent(form.submit),
        setForm: wrapEvent(form.setForm),
        set: wrapEvent(form.setForm), // set form alias
        formValidated: wrapEvent(form.formValidated),
    } as Result<Fields>
}
