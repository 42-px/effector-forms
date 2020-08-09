import { Store, combine } from "effector"
import {
    ValidationError,
    Rule,
    AnyFields,
} from "./types"

export function createCombineValidator<Value = any, Form = any>(
    rules: Rule<Value, Form>[]
) {
    return (value: Value, form?: Form): ValidationError<Value>[] => {

        const errors: ValidationError<Value>[] = []

        for (const rule of rules) {
            const result = rule.validator(value, form)

            if (typeof result === "boolean" && !result) {
                errors.push({
                    rule: rule.name,
                    value,
                })
            }

            if (typeof result === "object" && !result.isValid) {
                errors.push({
                    rule: rule.name,
                    errorText: result.errorText,
                    value,
                })
            }
        }

        return errors
    }
}


export function eachValid(fields: AnyFields) {
    const firstErrors: Store<ValidationError | null>[] = []
  
    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue
        const { $firstError } = fields[fieldName]
        firstErrors.push($firstError)
    }
  
    const $firstErrors = combine(firstErrors)
  
    return $firstErrors.map((errors) => errors.every(error => error === null))
}
