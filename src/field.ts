import {
    createStore,
    Domain,
    Event,
    Store,
    combine, 
    sample,
    guard,
} from "effector"
import {
    ValidationError,
    Field,
    FieldConfig,
    AnyFormValues,
    ValidationEvent,
    Rule,
} from "./types"
import { createCombineValidator } from "./validation"
import { createFormUnit } from "./create-form-unit"

export function createField(
    fieldName: string,
    fieldConfig: FieldConfig<any>,
    domain?: Domain,
): Field<any> {
    const initValue = typeof fieldConfig.init === "function"
        ? fieldConfig.init()
        : fieldConfig.init

    const $value = createFormUnit.store({
        domain,
        existing: fieldConfig.units?.$value,
        init: initValue,
    })

    const $errors = createFormUnit.store<ValidationError[]>({
        domain,
        existing: fieldConfig.units?.$errors,
        init: [],
    })
    

    const $firstError = $errors.map(
        (errors) => errors[0] ? errors[0] : null
    )

    const $isDirty = $value.map((value) => value !== initValue)

    const $touched = createFormUnit.store({
        domain,
        existing: fieldConfig.units?.$isTouched,
        init: false,
    })

    const onChange = createFormUnit.event({
        domain,
        existing: fieldConfig.units?.onChange,
    })
    const onBlur = createFormUnit.event({
        domain,
        existing: fieldConfig.units?.onBlur,
    })
    const changed = createFormUnit.event({
        domain,
        existing: fieldConfig.units?.changed,
    })
    const addError = createFormUnit.event<{
        rule: string
        errorText?: string 
    }>({
        domain,
        existing: fieldConfig.units?.addError,
    })
    const validate = createFormUnit.event({
        domain,
        existing: fieldConfig.units?.validate,
    })
    const resetErrors = createFormUnit.event({
        domain,
        existing: fieldConfig.units?.resetErrors,
    })
    const reset = createFormUnit.event({
        domain,
        existing: fieldConfig.units?.reset,
    })

    return {
        changed,
        name: fieldName,
        $value,
        $errors,
        $firstError,
        $isValid: $firstError.map((firstError) => firstError === null),
        $isDirty,
        $isTouched: $touched,
        $touched,
        onChange,
        onBlur,
        addError,
        validate,
        set: onChange,
        reset,
        resetErrors,
        filter: fieldConfig.filter,
    }
}

type BindValidationParams = {
  $form: Store<AnyFormValues>
  submitEvent: Event<void>
  resetFormEvent: Event<void>
  field: Field<any>
  rules: Rule<any, any>[]
  formValidationEvents: ValidationEvent[]
  fieldValidationEvents: ValidationEvent[]
}

export function bindValidation({
    $form,
    submitEvent,
    resetFormEvent,
    field,
    rules,
    formValidationEvents,
    fieldValidationEvents,
}: BindValidationParams): void {
    const {
        $value,
        $errors,
        onBlur,
        changed,
        addError,
        validate,
        resetErrors,
        reset,
    } = field

    const rulesSources = combine(rules.map(({ source }) => source || createStore(null)))

    const validator = createCombineValidator(rules)
    const eventsNames = [...formValidationEvents, ...fieldValidationEvents]
    const validationEvents: Event<{
        fieldValue: any
        form: AnyFormValues
        rulesSources: any[]
    }>[] = []

    if (eventsNames.includes("submit")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: $form,
                rulesSources,
            }),
            clock: submitEvent,
        }))
    }

    if (eventsNames.includes("blur")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: $form,
                rulesSources,
            }),
            clock: onBlur,
        }))
    }

    if (eventsNames.includes("change")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: $form,
                rulesSources,
            }),
            clock: changed,
        }))
    }

    validationEvents.push(sample({
        source: combine({
            fieldValue: $value,
            form: $form,
            rulesSources,
        }),
        clock: validate,
    }))

    const addErrorWithValue = sample({
        source: $value,
        clock: addError,
        fn: (value, { rule, errorText }): ValidationError => ({
            rule,
            value,
            errorText,
        }),  
    })

    $errors
        .on(
            validationEvents,
            (_, { form, fieldValue, rulesSources }) => validator(fieldValue, form, rulesSources)
        )
        .on(addErrorWithValue, (errors, newError) => [newError, ...errors])
        .reset(resetErrors, resetFormEvent, reset)

    if (!eventsNames.includes("change")) {
        $errors.reset(changed)
    }
}

export function bindChangeEvent(
    { $value, $touched, onChange, changed, name, reset, filter }: Field<any>,
    setForm: Event<Partial<AnyFormValues>>,
    resetForm: Event<void>,
    resetTouched: Event<void>,
): void {

    $touched
        .on(changed, () => true)
        .reset(reset, resetForm, resetTouched)

    guard({
        source: onChange,
        filter: filter || (() => true),
        target: changed,
    })

    $value
        .on(changed, (_, value) => value)
        .on(
            setForm,
            (curr, updateSet) => updateSet.hasOwnProperty(name) 
                ? updateSet[name] 
                : curr
        )
        .reset(reset, resetForm)
    
}
