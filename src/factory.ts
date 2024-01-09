import {
    EventCallable,
    Store,
    combine,
    createEvent,
    sample,
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

    const validate = units?.validate
      ? units.validate
      : createEvent({ domain })

    const submitForm = units?.submit
      ? units.submit
      : createEvent({ domain })

    const formValidated = units?.formValidated
      ? units.formValidated
      : createEvent<Values>({ domain })

    const setInitialForm = units?.setInitialForm
      ? units.setInitialForm
      : createEvent<Partial<AnyFormValues>>({ domain })

    const setForm = units?.setForm
      ? units.setForm
      : createEvent<Partial<AnyFormValues>>({ domain })

    const addErrors = units?.addErrors
      ? units.addErrors
      : createEvent<AddErrorPayload[]>({ domain })

    const resetForm = units?.reset
      ? units.reset
      : createEvent({ domain })

    const resetValues = units?.resetValues
      ? units.resetValues
      : createEvent({ domain })

    const resetErrors = units?.resetErrors
      ? units.resetErrors
      : createEvent({ domain })

    const resetTouched = units?.resetTouched
      ? units.resetTouched
      : createEvent({ domain })

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

    sample({
        source: submitWithFormData as unknown as EventCallable<Values>,
        filter: $isFormValid,
        // TODO: fix
        target: formValidated,
    })

    sample({
        source: validateWithFormData as unknown as EventCallable<Values>,
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
