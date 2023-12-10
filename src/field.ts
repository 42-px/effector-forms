import {
    createStore,
    Domain,
    EventCallable,
    Store,
    combine,
    sample,
    merge,
    Event,
    createEvent,
} from "effector"
import {
    ValidationError,
    Field,
    FieldData,
    FieldConfig,
    AnyFormValues,
    ValidationEvent,
    AddErrorPayload,
    FieldUnitShape,
} from "./types"
import { createCombineValidator } from "./validation"

/**
 * @group Factories
 */
export function createField(
    fieldName: string,
    fieldConfig: FieldConfig<any>,
    domain?: Domain,
): Field<any> {
    const initValue = typeof fieldConfig.init === "function"
        ? fieldConfig.init()
        : fieldConfig.init

    const $value = fieldConfig.units?.$value
      ? fieldConfig.units.$value
      : createStore(initValue, { sid: `${fieldName}-$value`, domain })

    const $errors = fieldConfig.units?.$errors
      ? fieldConfig.units.$errors
      : createStore<ValidationError[]>([], { sid: `${fieldName}-$errors`, domain })

    const $firstError = $errors.map((errors) => errors[0] ? errors[0] : null)

    const $initValue = fieldConfig.units?.$initValue
      ? fieldConfig.units.$initValue
      : createStore(initValue, { sid: `${fieldName}-$initValue`, domain })

    const $touched = fieldConfig.units?.$isTouched
      ? fieldConfig.units.$isTouched
      : createStore(false, { sid: `${fieldName}-$touched`, domain })

    const $isDirty = combine($value, $initValue,
        (value, initValue) => value !== initValue,
    )

    const onChange = fieldConfig.units?.onChange
      ? fieldConfig.units.onChange
      : createEvent({ domain })

    const onBlur = fieldConfig.units?.onBlur
      ? fieldConfig.units.onBlur
      : createEvent({ domain })

    const changed = fieldConfig.units?.changed
      ? fieldConfig.units.changed
      : createEvent({ domain })

    const addError = fieldConfig.units?.addError
      ? fieldConfig.units.addError
      : createEvent<{ rule: string; errorText?: string }>({ domain })

    const validate = fieldConfig.units?.validate
      ? fieldConfig.units.validate
      : createEvent({ domain })

    const resetErrors = fieldConfig.units?.resetErrors
      ? fieldConfig.units.resetErrors
      : createEvent({ domain })

    const resetValue = fieldConfig.units?.resetValue
      ? fieldConfig.units.resetValue
      : createEvent({ domain })

    const reset = fieldConfig.units?.reset
      ? fieldConfig.units.reset
      : createEvent({ domain });

    const $isValid = $firstError.map((firstError) => firstError === null)
    const $errorText = $firstError.map(
        (firstError) => firstError?.errorText || ""
    )

    const $field = combine({
        value: $value,
        errors: $errors,
        firstError: $firstError,
        isValid: $isValid,
        isDirty: $isDirty,
        isTouched: $touched,
    })

    const unitShape: FieldUnitShape<any> = {
        value: $value,
        initValue: $initValue,
        isValid: $isValid,
        isDirty: $isDirty,
        touched: $touched,
        errors: $errors,
        firstError: $firstError,
        errorText: $errorText,
        onChange,
        onBlur,
        addError,
        validate,
        reset,
        resetErrors,
        resetValue,
    }

    return {
        changed,
        "name": fieldName,
        $initValue,
        $value,
        $errors,
        $firstError,
        $errorText,
        $isValid,
        $isDirty,
        "$isTouched": $touched,
        $touched,
        "$field": $field as Store<FieldData<any>>,
        onChange,
        onBlur,
        addError,
        validate,
        "set": onChange,
        reset,
        resetErrors,
        resetValue,
        "filter": fieldConfig.filter,
        "@@unitShape": () => unitShape,
    }
}

type BindValidationParams = {
    form: {
        $values: Store<AnyFormValues>
        submit: EventCallable<void>
        reset: EventCallable<void>
        resetValues: EventCallable<void>
        resetErrors: EventCallable<void>
        addErrors: EventCallable<AddErrorPayload[]>
        validate: EventCallable<void>
        validateOn?: ValidationEvent[]
    }
    field: Field<any>
    fieldConfig: FieldConfig<any>
}

export function bindValidation(
    params: BindValidationParams, effectorData?: any
): void {
    const { form, field, fieldConfig } = params
    const rules = fieldConfig.rules || []
    const formValidationEvents = form.validateOn || ["submit"]
    const fieldValidationEvents = fieldConfig.validateOn || []

    const {
        $value,
        $errors,
        onBlur,
        changed,
        addError,
        validate,
        resetErrors,
        resetValue,
        reset,
    } = field

    const rulesSources = typeof rules === "function"
        ? createStore<any[]>([], { sid: `${field.name}-$rulesSources` })
        : combine(
            rules.map(({ source }, i) => {
                const sid = `${field.name}-$rulesSources-${i}`
                return source || createStore(null, { sid })
            })
        )

    const validator = createCombineValidator(rules)
    const eventsNames = [...formValidationEvents, ...fieldValidationEvents]
    const validationEvents: Event<{
        fieldValue: any
        form: AnyFormValues
        rulesSources: any[]
    }>[] = []

    if (eventsNames.includes("submit")) {
        const validationTrigger = sample({
            source: combine({
                fieldValue: $value,
                form: form.$values,
                rulesSources,
            }),
            clock: form.submit,
        })

        validationEvents.push(validationTrigger)
    }

    if (eventsNames.includes("blur")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: form.$values,
                rulesSources,
            }),
            clock: onBlur,
        }))
    }

    if (eventsNames.includes("change")) {
        validationEvents.push(sample({
            source: combine({
                fieldValue: $value,
                form: form.$values,
                rulesSources,
            }),
            clock: merge(
                [changed, resetValue, form.resetValues]
            ),
        }))
    }

    validationEvents.push(sample({
        source: combine({
            fieldValue: $value,
            form: form.$values,
            rulesSources,
        }),
        clock: validate,
    }))

    validationEvents.push(sample({
        source: combine({
            fieldValue: $value,
            form: form.$values,
            rulesSources,
        }),
        clock: form.validate,
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

    const addErrorsWithValue = sample({
        source: $value,
        clock: form.addErrors,
        fn: (value, errors) => ({
            value,
            newErrors: errors,
        })
    })

    $errors
        .on(
            validationEvents,
            (_, { form, fieldValue, rulesSources }) => validator(
                fieldValue,
                form,
                rulesSources,
            )
        )
        .on(addErrorWithValue, (errors, newError) => [newError, ...errors])
        .on(addErrorsWithValue, (currErrors, { value, newErrors }) => {
            const matchedErrors: ValidationError[] = []

            for (const newError of newErrors) {
                if (newError.field !== field.name) continue
                matchedErrors.push({
                    value,
                    rule: newError.rule,
                    errorText: newError.errorText,
                })
            }

            return [...matchedErrors, ...currErrors]
        })
        .reset(resetErrors, form.reset, reset, form.resetErrors)

    if (!eventsNames.includes("change")) {
        $errors.reset(changed)
    }
}

type BindChangeEventParams = {
    field: Field<any>
    form: {
        setForm: EventCallable<Partial<AnyFormValues>>
        setInitialForm: EventCallable<Partial<AnyFormValues>>
        resetForm: EventCallable<void>
        resetTouched: EventCallable<void>
        resetValues: EventCallable<void>
    }
}

export function bindChangeEvent({
    field,
    form,
}: BindChangeEventParams): void {
    const {
        $value,
        $initValue,
        $touched,
        onChange,
        changed,
        name,
        reset,
        resetValue,
        filter
    } = field

    const {
        setForm,
        setInitialForm,
        resetForm,
        resetTouched,
        resetValues
    } = form

    const resetValueWithInit = sample({
        source: $initValue,
        clock: merge([
            reset,
            resetValue,
            resetValues,
            resetForm
        ]),
    })

    $touched
        .on(changed, () => true)
        .reset(reset, resetForm, resetTouched)


    if (filter) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sample({
            source: onChange,
            filter: filter,
            target: changed,
        })
    } else {
        sample({
            source: onChange,
            filter: (() => true),
            target: changed,
        })
    }


    $initValue
        .on(setInitialForm, (curr, updateSet) => updateSet.hasOwnProperty(name)
            ? updateSet[name]
            : curr
        )

    $value
        .on(changed, (_, value) => value)
        .on(
            [setForm, setInitialForm],
            (curr, updateSet) => updateSet.hasOwnProperty(name)
                ? updateSet[name]
                : curr
        )
        .on(resetValueWithInit, (_, initValue) => initValue)
}
