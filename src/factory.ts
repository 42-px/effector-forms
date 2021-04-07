import {
    Event,
    Store,
    combine,
    sample,
    guard,
} from "effector"
import {
    FieldConfig,
    Field,
    AnyFields,
    AnyFieldsConfigs,
    AnyFormValues,
    FormConfig,
    FormValues,
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


export type Form<Fields extends AnyFieldsConfigs> = {
  fields: {
    [K in keyof Fields]: Fields[K] extends FieldConfig<infer U>
      ? Field<U>
      : never
  }
  $values: Store<FormValues<Fields>>
  $eachValid: Store<boolean>
  $isValid: Store<boolean>
  $isDirty: Store<boolean>
  $touched: Store<boolean>
  $meta: Store<{
    isValid: boolean,
    isDirty: boolean,
    touched: boolean,
  }>
  submit: Event<void>
  validate: Event<void>
  reset: Event<void>
  set: Event<Partial<FormValues<Fields>>>
  setForm: Event<Partial<FormValues<Fields>>>
  resetTouched: Event<void>
  resetValues: Event<void>
  resetErrors: Event<void>
  formValidated: Event<FormValues<Fields>>
}


export function createForm<Fields extends AnyFieldsConfigs>(
    config: FormConfig<Fields>
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
    
    const submitWithFormData = sample($form, submitForm)
    const validateWithFormData = sample($form, validate)

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
        })
    }

    guard({
        source: submitWithFormData,
        filter: $isFormValid,
        target: formValidated,
    })

    guard({
        source: validateWithFormData,
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
    } as unknown as Form<Fields>
}
