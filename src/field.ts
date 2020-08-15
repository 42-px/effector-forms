import {
    Domain,
    Event,
    Store,
    createStore,
    createEvent,
    combine, 
    sample,
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

export function createField(
    fieldName: string,
    fieldConfig: FieldConfig<any>,
    domain?: Domain,
): Field<any> {
    const initValue = typeof fieldConfig.init === "function"
        ? fieldConfig.init()
        : fieldConfig.init

    const $value = domain ? domain.store(initValue) : createStore(initValue)

    const $errors = domain
        ? domain.store<ValidationError[]>([])
        : createStore<ValidationError[]>([])

    const $firstError = $errors.map(
        (errors) => errors[0] ? errors[0] : null
    )

    const onChange = domain ? domain.event() : createEvent()
    const onBlur = domain ? domain.event() : createEvent()
    const addError = domain
        ? domain.event<{ rule: string; errorText?: string }>()
        : createEvent<{ rule: string; errorText?: string }>()
    const validate = domain ? domain.event() : createEvent()
    const resetErrors = domain ? domain.event() : createEvent()

    return {
        name: fieldName,
        $value,
        $errors,
        $firstError,
        onChange,
        onBlur,
        addError,
        validate,
        resetErrors,
    }
}

type BindValidationParams = {
  $form: Store<AnyFormValues>
  submitEvent: Event<void>
  field: Field<any>
  rules: Rule<any, any>[]
  formValidationEvents: ValidationEvent[]
  fieldValidationEvents: ValidationEvent[]
}

export function bindValidation({
    $form,
    submitEvent,
    field,
    rules,
    formValidationEvents,
    fieldValidationEvents
}: BindValidationParams): void {
    const {
        $value,
        $errors,
        onBlur,
        onChange,
        addError,
        validate,
        resetErrors
    } = field
    const validator = createCombineValidator(rules)
    const eventsNames = [...formValidationEvents, ...fieldValidationEvents]
    const validationEvents: Event<{
        fieldValue: any
        form: AnyFormValues
    }>[] = []

    if (eventsNames.includes("submit")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: $form,
            }),
            clock: submitEvent,
        }))
    }

    if (eventsNames.includes("blur")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: $form,
            }),
            clock: onBlur,
        }))
    }

    if (eventsNames.includes("change")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: $form,
            }),
            clock: onChange,
        }))
    }

    validationEvents.push(sample({
        source: combine({
            fieldValue: $value,
            form: $form,
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
            (_, { form, fieldValue }) => validator(fieldValue, form)
        )
        .on(addErrorWithValue, (errors, newError) => [newError, ...errors])
        .reset(resetErrors)

    if (!eventsNames.includes("change")) {
        $errors.reset(onChange)
    }
}

export function bindChangeEvent(
    { $value, onChange, name }: Field<any>,
    setForm: Event<Partial<AnyFormValues>>,
): void {

    $value
        .on(onChange, (_, value) => value)
        .on(
            setForm,
            (curr, updateSet) => updateSet.hasOwnProperty(name) 
                ? updateSet[name] 
                : curr
        )
}
