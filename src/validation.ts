import { Store, combine } from "effector"
import {
    ValidationError,
    Rule,
    AnyFields,
    RuleResolver,
} from "./types"

export function createCombineValidator<Value = any, Form = any>(
    rulesOrResolver: Rule<Value, Form, any>[] | RuleResolver<Value, Form>
) {
    return (
        value: Value,
        form: Form,
        rulesSources?: any[]
    ): ValidationError<Value>[] => {

        const errors: ValidationError<Value>[] = []
        const rules = typeof rulesOrResolver === "function"
            ? rulesOrResolver(value, form)
            : rulesOrResolver

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i]
            const source = rulesSources ? rulesSources[i] : null
            const result = rule.validator(value, form, source)

            if (typeof result === "boolean" && !result) {
                errors.push({
                    rule: rule.name,
                    errorText: rule.errorText,
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
