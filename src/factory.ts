import {
    Event,
    Store,
    combine,
    sample,
    guard,
    createStore,
} from "effector"
import {
    AnyFields,
    AnyFormValues,
    FormConfig,
    Form,
    AddErrorPayload,
    FormUnitShape,
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

/**
 * This is the main factory in the library that creates
 * the forms shape according to the given configuration.
 * 
 * Do not try to pass a type in the Values generic! Form types are inferred automatically from the passed "fields" object
 * 
 * @param config - The form configuration object
 * @returns The shape of effector units
 * @example
 * 
 * ```ts
 * const form = createForm({
 *      fields: {
 *          username: {
 *              init: "",
 *              rules: [
 *                  {
 *                      name: "required",
 *                      validator: (value: string) => Boolean(value)
 *                  }
 *              ]
 *          },
 *          bio: {
 *              init: "",
 *              rules: []
 *          }
 *      },
 *      validateOn: ["change"],
 * })
 * ```
 * @group Factories
 */
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
        const field = createField(fieldName, fieldConfig, domain)

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

    const setInitialForm = createFormUnit.event<Partial<AnyFormValues>>({
        domain,
        existing: units?.setInitialForm as Event<Partial<AnyFormValues>>,
    })

    const setForm = createFormUnit.event<Partial<AnyFormValues>>({
        domain,
        existing: units?.setForm as Event<Partial<AnyFormValues>>,
    })

    const addErrors = createFormUnit.event<AddErrorPayload[]>({
        domain,
        existing: units?.addErrors,
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

        bindChangeEvent({
            form: {
                setForm,
                setInitialForm,
                resetForm,
                resetTouched,
                resetValues
            },
            field,
        })
        bindValidation({
            form: {
                $values: $form,
                submit: submitForm,
                reset: resetForm,
                addErrors,
                resetValues,
                resetErrors,
                validate,
                validateOn,
            },
            fieldConfig,
            field,
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

    const unitShape: FormUnitShape<any> = {
        isValid: $eachValid,
        isDirty: $isDirty,
        touched: $touched,
        submit: submitForm,
        reset: resetForm,
        addErrors: addErrors,
        validate,
        setForm,
        setInitialForm,
        resetTouched,
        resetValues,
        resetErrors,
        formValidated,
    }

    return {
        fields,
        "$values": $form,
        $eachValid,
        "$isValid": $eachValid,
        "$isDirty": $isDirty,
        "$touched": $touched,
        $meta,
        "submit": submitForm,
        validate,
        resetTouched,
        addErrors,
        "reset": resetForm,
        resetValues,
        resetErrors,
        setForm,
        setInitialForm,
        "set": setForm,
        formValidated,
        "@@unitShape": () => unitShape,
    } as unknown as Form<Values>
}
