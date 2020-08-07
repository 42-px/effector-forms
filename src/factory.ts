import {
    Event,
    Store,
    Domain,
    combine,
    sample,
    guard,
    createEffect,
    createDomain,
    createEvent,
    createStore,
} from "effector"
import { Rule, ValidationError } from "./types"
import { createCombineValidator } from "./validator"

type InitFunc<Value> = () => Value

type ValidationEvent = "submit" | "blur" | "change"

type AnyFields = {
  [key: string]: FieldsConfig<any>
}

type AnyForm = {
  [key: string]: any
}


export type FieldsUnits<Value> = {
  name: string
  $value: Store<Value>
  $errors: Store<ValidationError[]>
  $firstError: Store<ValidationError | null>
  onChange: Event<Value>
  onBlur: Event<void>
}

export type FieldsConfig<Value> = {
  init: Value | InitFunc<Value>
  rules?: Rule<Value>[]
  validateOn?: ValidationEvent[]
}

export type FormConfig<Fields extends AnyFields> = {
  fields: Fields
  domain?: Domain
  filter?: Store<boolean>
  validateOn?: ValidationEvent[]
}

type AnyFieldsUnits ={
  [key: string]: FieldsUnits<any>
}

export function createFieldsUnits(
    fieldName: string,
    fieldsConfig: FieldsConfig<any>,
    domain?: Domain,
): FieldsUnits<any> {
    const initValue = typeof fieldsConfig.init === "function"
        ? fieldsConfig.init()
        : fieldsConfig.init

    const $value = domain ? domain.store(initValue) : createStore(initValue)

    const $errors = domain
        ? domain.store<ValidationError[]>([])
        : createStore<ValidationError[]>([])
  
    const $firstError = $errors.map(
        (errors) => errors[0] ? errors[0] : null
    )

    const onChange = domain ? domain.event() : createEvent()
    const onBlur = domain ? domain.event() : createEvent()
 
    return {
        name: fieldName,
        $value,
        $errors,
        $firstError,
        onChange,
        onBlur,
    }
}

export function createFormValuesStore(
    fields: AnyFieldsUnits
): Store<AnyForm> {
    const shape: { [key: string]: Store<any> } = {}
  
    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue
        shape[fieldName] = fields[fieldName].$value
    }

    return combine(shape)
}

function bindChangeEvent(
    { $value, onChange, name }: FieldsUnits<any>,
    setForm: Event<Partial<AnyForm>>,
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


type BindValidationParams = {
  $form: Store<AnyForm>
  submitEvent: Event<void>
  units: FieldsUnits<any>
  rules: Rule<any, any>[]
  formValidationEvents: ValidationEvent[]
  fieldValidationEvents: ValidationEvent[]
}

function bindValidation({
    $form,
    submitEvent,
    units,
    rules,
    formValidationEvents,
    fieldValidationEvents
}: BindValidationParams): void {
    const { $value, $errors, onBlur, onChange } = units
    const validator = createCombineValidator(rules)
    const eventsNames = [...formValidationEvents, ...fieldValidationEvents]
    const validationEvents: Event<{ field: any; form: AnyForm }>[] = []

    if (eventsNames.includes("submit")) {
        validationEvents.push(sample({
            source: combine({
                field: $value,
                form: $form,
            }),
            clock: submitEvent,
        }))
    }

    if (eventsNames.includes("blur")) {
        validationEvents.push(sample({
            source: combine({
                field: $value,
                form: $form,
            }),
            clock: onBlur,
        }))
    }

    if (eventsNames.includes("change")) {
        validationEvents.push(sample({
            source: combine({
                field: $value,
                form: $form,
            }),
            clock: onChange,
        }))
    }

    $errors
        .on(validationEvents, (_, { form, field }) => validator(field, form))

    if (!eventsNames.includes("change")) {
        $errors.reset(onChange)
    }
}

function eachValid(fields: AnyFieldsUnits) {
    const firstErrors: Store<ValidationError | null>[] = []

    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue
        const { $firstError } = fields[fieldName]
        firstErrors.push($firstError)
    }

    const $firstErrors = combine(firstErrors)

    return $firstErrors.map((errors) => errors.some(error => error !== null))
}

type FormValues<Fields extends AnyFields> = {
  [K in keyof Fields]: Fields[K] extends FieldsConfig<infer U>
    ? U
    : Fields[K]
}

type Form<Fields extends AnyFields> = {
  fields: {
    [K in keyof Fields]: Fields[K] extends FieldsConfig<infer U>
      ? FieldsUnits<U>
      : Fields[K]
  }
  $values: Store<FormValues<Fields>>
  $eachValid: Store<boolean>
  submit: Event<void>
  setForm: Event<Partial<FormValues<Fields>>>
  formValidated: Event<FormValues<Fields>>
}


export function createForm<Fields extends AnyFields>(
    config: FormConfig<Fields>
) {
    const {
        filter: $filter,
        domain,
        fields: fieldsConfigs,
        validateOn,
    } = config

    const fields: AnyFieldsUnits = {}

    // create units
    for (const fieldName in fieldsConfigs) {
        if (!fieldsConfigs.hasOwnProperty(fieldName)) continue

        const fieldsConfig = fieldsConfigs[fieldName]

        fields[fieldName] = createFieldsUnits(fieldName, fieldsConfig, domain)
    }

    const $form = createFormValuesStore(fields)
    const $eachValid = eachValid(fields)
    const $isFormValid = $filter
        ? combine($eachValid, $filter, (valid, filter) => valid && filter)
        : $eachValid
  
    const submitForm = domain ? domain.event<void>() : createEvent<void>()
    const formValidated = domain 
        ? domain.event<AnyForm>()
        : createEvent<AnyForm>()

    const setForm = domain
        ? domain.event<Partial<AnyForm>>()
        : createEvent<Partial<AnyForm>>()

    const submitWithFormData = sample($form, submitForm)

    // bind units
    for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue

        const fieldConfig = fieldsConfigs[fieldName]
        const fieldUnits = fields[fieldName]

        bindChangeEvent(fieldUnits, setForm)

        if (!fieldConfig.rules) continue

        bindValidation({
            $form,
            rules: fieldConfig.rules,
            submitEvent: submitForm,
            units: fieldUnits,
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


type User = {
  username: string
  password: string
}

const createUserFx = createEffect<User, void, Error>()
const $serverError = createStore<Error | null>(null)

$serverError.on(createUserFx.failData, (_, error) => error)

const form = createForm({
    domain: createDomain("my-form"),
    validateOn: ["submit"],
    filter: combine(
        $serverError,
        createUserFx.pending,
        (serverError, pending) => !serverError && !pending,
    ),
    fields: {
        username: {
            init: "",
            rules: [
                {
                    name: "required",
                    validator: (name: string) => Boolean(name), 
                }
            ],
        },
        password: {
            init: "",
            rules: [
                {
                    name: "required",
                    validator: (password: string) => Boolean(password),
                    validateOn: ["blur"]
                }
            ]
        }
    },
})

// массивом лучше 
