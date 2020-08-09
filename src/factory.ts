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


type FormValues<Fields extends AnyFieldsConfigs> = {
  [K in keyof Fields]: Fields[K] extends FieldConfig<infer U>
    ? U
    : never
}

type Form<Fields extends AnyFieldsConfigs> = {
  fields: {
    [K in keyof Fields]: Fields[K] extends FieldConfig<infer U>
      ? Field<U>
      : never
  }
  $values: Store<FormValues<Fields>>
  $eachValid: Store<boolean>
  submit: Event<void>
  setForm: Event<Partial<FormValues<Fields>>>
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

    // create units
    for (const fieldName in fieldsConfigs) {
        if (!fieldsConfigs.hasOwnProperty(fieldName)) continue

        const fieldConfig = fieldsConfigs[fieldName]

        fields[fieldName] = createField(fieldName, fieldConfig, domain)
    }

    const $form = createFormValuesStore(fields)
    const $eachValid = eachValid(fields)
    const $isFormValid = $filter
        ? combine($eachValid, $filter, (valid, filter) => valid && filter)
        : $eachValid
  
    const submitForm = domain ? domain.event<void>() : createEvent<void>()
    const formValidated = domain 
        ? domain.event<AnyFormValues>()
        : createEvent<AnyFormValues>()

    const setForm = domain
        ? domain.event<Partial<AnyFormValues>>()
        : createEvent<Partial<AnyFormValues>>()

    const submitWithFormData = sample($form, submitForm)

    // bind units
    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue

        const fieldConfig = fieldsConfigs[fieldName]
        const field = fields[fieldName]

        bindChangeEvent(field, setForm)

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
        submit: submitForm,
        setForm,
        formValidated,
    } as unknown as Form<Fields>
}
