import {
    Event,
    Store,
    combine,
    sample,
    guard,
    createEvent,
} from "effector"
import {
    FieldConfig,
    Field,
    AnyFields,
    AnyFieldsConfigs,
    AnyFormValues,
    FormConfig,
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


export type FormValues<Fields extends AnyFieldsConfigs> = {
  [K in keyof Fields]: Fields[K] extends FieldConfig<infer U>
    ? U
    : never
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
  submit: Event<void>
  reset: Event<void>
  set: Event<Partial<FormValues<Fields>>>
  setForm: Event<Partial<FormValues<Fields>>>
  resetTouched: Event<void>
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
  
    const submitForm = domain ? domain.event<void>() : createEvent<void>()
    const formValidated = domain 
        ? domain.event<AnyFormValues>()
        : createEvent<AnyFormValues>()

    const setForm = domain
        ? domain.event<Partial<AnyFormValues>>()
        : createEvent<Partial<AnyFormValues>>()

    const resetForm = domain
        ? domain.event<void>()
        : createEvent<void>()

    const resetTouched = domain
        ? domain.event<void>()
        : createEvent<void>()

    const submitWithFormData = sample($form, submitForm)

    // bind units
    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue

        const fieldConfig = fieldsConfigs[fieldName]
        const field = fields[fieldName]

        bindChangeEvent(field, setForm, resetForm, resetTouched)

        if (!fieldConfig.rules) continue

        bindValidation({
            $form,
            rules: fieldConfig.rules,
            submitEvent: submitForm,
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

    return {
        fields,
        $values: $form,
        $eachValid,
        $isValid: $eachValid,
        $isDirty: $isDirty,
        $touched: $touched,
        submit: submitForm,
        resetTouched,
        reset: resetForm,
        setForm,
        set: setForm,
        formValidated,
    } as unknown as Form<Fields>
}
