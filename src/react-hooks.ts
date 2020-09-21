import { useStore } from "effector-react"
import { Event } from "effector"
import { Form } from "./factory"
import {
    Field,
    FormValues,
    ValidationError,
    FieldConfig,
    AnyFieldsConfigs
} from "./types"

type ErrorTextMap = {
  [key: string]: string
}

type ConnectedField<Value> = {
  name: string
  value: Value
  errors: ValidationError<Value>[]
  firstError: ValidationError<Value> | null
  hasError: () => boolean
  onChange: Event<Value>
  onBlur: Event<void>
  errorText: (map?: ErrorTextMap) => string
  addError: Event<{ rule: string; errorText?: string }>
  validate: Event<void>
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
  touched: boolean
  reset: Event<void>
  set: Event<Value>
  resetErrors: Event<void>
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
    const value = useStore(field.$value)
    const errors = useStore(field.$errors)
    const firstError = useStore(field.$firstError)
    const isValid = useStore(field.$isValid)
    const isDirty = useStore(field.$isDirty)
    const touched = useStore(field.$touched)

    return {
        name: field.name,
        value,
        errors,
        firstError,
        isValid,
        isDirty,
        touched,
        isTouched: touched,
        onChange: field.onChange,
        onBlur: field.onBlur,
        addError: field.addError,
        validate: field.validate,
        reset: field.reset,
        set: field.onChange,
        resetErrors: field.resetErrors,
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
  submit: Event<void>
  reset: Event<void>
  setForm: Event<Partial<FormValues<Fields>>>
  set: Event<Partial<FormValues<Fields>>>
  formValidated: Event<FormValues<Fields>>
}

export function useForm<Fields extends AnyFieldsConfigs>(
    form: Form<Fields>
) {
    const connectedFields = {} as AnyConnectedFields

    for (const fieldName in form.fields) {
        if (!form.fields.hasOwnProperty(fieldName)) continue 
        const field = form.fields[fieldName]

        connectedFields[fieldName] = useField(field)
    }

    const values = useStore(form.$values)
    const eachValid = useStore(form.$eachValid)
    const isDirty = useStore(form.$isDirty)
    const touched = useStore(form.$touched)


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
        reset: form.reset,
        errorText,
        submit: form.submit,
        setForm: form.setForm,
        set: form.setForm, // set form alias
        formValidated: form.formValidated,
    } as Result<Fields>
}
