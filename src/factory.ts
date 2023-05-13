import {
    Event,
    Store,
    combine,
    sample,
    guard,
} from "effector"
import {
    AnyFields,
    AnyFormValues,
    FormConfig,
    Form,
} from "./types"
import { eachValid } from "./validation"
import {
    createField,
    bindValidation,
    bindChangeEvent,
} from "./field"
import { createFormUnit } from "./create-form-unit"

function createFormValuesStore(
    fields: AnyFields
): Store<AnyFormValues> {
    const shape: { [key: string]: Store<any> } = {}

    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue
        shape[fieldName] = fields[fieldName].$value
    }

    return combine(shape)
}

export function createForm<Values extends AnyFormValues>(
    config: FormConfig<Values>
) {
    const {
        filter: $filter,
        domain,
        fields: fieldsConfigs,
        validateOn,
        units,
    } = config

    const fields: AnyFields = {}

    const dirtyFlagsArr: Store<boolean>[] = []
    const touchedFlagsArr: Store<boolean>[] = []

    // create units
    for (const fieldName in fieldsConfigs) {
        if (!fieldsConfigs.hasOwnProperty(fieldName)) continue

        const fieldConfig = fieldsConfigs[fieldName]

        const field = createField(fieldName, fieldConfig, domain, {
            sid: fieldName
        })

        fields[fieldName] = field
        dirtyFlagsArr.push(field.$isDirty)
        touchedFlagsArr.push(field.$touched)
    }

    const $form = createFormValuesStore(fields)
    const $eachValid = eachValid(fields)
    const $isFormValid = $filter
        ? combine($eachValid, $filter, (valid, filter) => valid && filter)
        : $eachValid
    const $isDirty = combine(dirtyFlagsArr).map(
        (dirtyFlags) => dirtyFlags.some(Boolean)
    )
    const $touched = combine(touchedFlagsArr).map(
        (touchedFlags) => touchedFlags.some(Boolean)
    )

    const $meta = combine({
        isValid: $eachValid,
        isDirty: $isDirty,
        touched: $touched,
    })

    const validate = createFormUnit.event<void>({
        domain,
        existing: units?.validate,
    })

    const submitForm = createFormUnit.event<void>({
        domain,
        existing: units?.submit,
    })

    const formValidated = createFormUnit.event({
        domain,
        existing: units?.formValidated,
    })


    const setForm = createFormUnit.event<Partial<AnyFormValues>>({
        domain,
        existing: units?.setForm as Event<Partial<AnyFormValues>>,
    })

    const resetForm = createFormUnit.event({
        domain,
        existing: units?.reset,
    })

    const resetValues = createFormUnit.event({
        domain,
        existing: units?.resetValues,
    })

    const resetErrors = createFormUnit.event({
        domain,
        existing: units?.resetErrors,
    })

    const resetTouched = createFormUnit.event({
        domain,
        existing: units?.resetTouched,
    })

    const submitWithFormData = sample({
        source: $form,
        clock: submitForm,
    })
    const validateWithFormData = sample({
        source: $form,
        clock: validate
    })

    // bind units
    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue

        const fieldConfig = fieldsConfigs[fieldName]
        const field = fields[fieldName]

        bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)

        if (!fieldConfig.rules) continue

        bindValidation({
            $form,
            rules: fieldConfig.rules,
            submitEvent: submitForm,
            resetFormEvent: resetForm,
            resetValues,
            resetErrors,
            validateFormEvent: validate,
            field,
            formValidationEvents: validateOn ? validateOn : ["submit"],
            fieldValidationEvents: fieldConfig.validateOn
                ? fieldConfig.validateOn
                : [],
        }, { sid: fieldName })
    }

    guard({
        source: submitWithFormData as unknown as Event<Values>,
        filter: $isFormValid,
        // TODO: fix
        target: formValidated,
    })

    guard({
        source: validateWithFormData as unknown as Event<Values>,
        filter: $isFormValid,
        target: formValidated,
    })

    return {
        fields,
        $values: $form,
        $eachValid,
        $isValid: $eachValid,
        $isDirty: $isDirty,
        $touched: $touched,
        $meta,
        submit: submitForm,
        validate,
        resetTouched,
        reset: resetForm,
        resetValues,
        resetErrors,
        setForm,
        set: setForm,
        formValidated,
    } as unknown as Form<Values>
}
