import { ValidationError, Rule } from "./types"

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
