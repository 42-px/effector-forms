import { createEvent, createStore } from "effector"
import { ValidationError, FieldConfig, Rule, ValidationEvent } from "./types"
import { createField, bindValidation, bindChangeEvent } from "./field"

test("create field", () => {
    const field = createField("email", {
        init: "value",
    })

    expect(field.$value.getState()).toBe("value")
    expect(field.$errors.getState()).toEqual([])
    expect(field.$firstError.getState()).toBeNull()

    const addError = createEvent<ValidationError>()
    field.$errors.on(addError, (errors, error) => [...errors, error])

    const error = {
        rule: "email",
        value: "value" 
    }
    const error2 = {
        rule: "minLength",
        value: "value",
    }
    addError(error)
    addError(error2)

    expect(field.$errors.getState()).toEqual([
        error,
        error2,
    ])
    expect(field.$firstError.getState()).toEqual(error)
})

test("bind change event", () => {
    const field = createField("email", {
        init: "",
    })

    const setForm = createEvent<Partial<{ email: string }>>()

    bindChangeEvent(field, setForm)
    
    field.onChange("123")
    expect(field.$value.getState()).toEqual("123")

    setForm({})
    expect(field.$value.getState()).toEqual("123")
    setForm({ email: "1234" })
    expect(field.$value.getState()).toEqual("1234")
})


function email() {
    return {
        name: "email",
        validator: (value: string) => /\S+@\S+\.\S+/.test(value)
    }
}

test("bind validation: validate on change", () => {
    const rules: Rule<string, any>[] = [
        email(),
    ]

    const validateOn: ValidationEvent[] = ["change"]

    const fieldConfig: FieldConfig<any> = {
        init: "",
        rules,
        validateOn,
    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()

    bindChangeEvent(field, setForm)
    bindValidation({
        $form,
        submitEvent: submit,
        field,
        rules,
        fieldValidationEvents: validateOn,
        formValidationEvents: ["submit"],
    })

    field.onChange("234")
    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "234",
    })

    field.onChange("234gmail.com")
    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "234gmail.com",
    })

    field.onChange("234@gmail.com")
    expect(field.$firstError.getState()).toBeNull()
    
})

test("bind validation: validate on blur", () => {
    const rules: Rule<string, any>[] = [
        email(),
    ]

    const validateOn: ValidationEvent[] = ["blur"]

    const fieldConfig: FieldConfig<any> = {
        init: "",
        rules,
        validateOn,
    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()

    bindChangeEvent(field, setForm)
    bindValidation({
        $form,
        submitEvent: submit,
        field,
        rules,
        fieldValidationEvents: validateOn,
        formValidationEvents: ["submit"],
    })
    
    field.onChange("1245")
    expect(field.$firstError.getState()).toBeNull()
    
    field.onBlur()
    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "1245",
    })
    field.onChange("1245@")
    expect(field.$firstError.getState()).toBeNull()

    submit()
    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "1245@",
    })

    field.onChange("1245@gmail.com")
    expect(field.$firstError.getState()).toBeNull()
    submit()
    expect(field.$firstError.getState()).toBeNull()
})

test("add error manually", () => {
    const fieldConfig: FieldConfig<any> = {
        init: "",
        validateOn: ["change"],
    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()

    bindChangeEvent(field, setForm)
    bindValidation({
        $form,
        submitEvent: submit,
        field,
        rules: [],
        fieldValidationEvents: ["change"],
        formValidationEvents: ["submit"],
    })


    field.onChange("123")

    field.addError({
        rule: "custom-rule",
        errorText: "error-text"
    })

    expect(field.$firstError.getState()).toEqual({
        rule: "custom-rule",
        errorText: "error-text",
        value: "123",
    })

    field.onChange("123")

    expect(field.$firstError.getState()).toBeNull()
})


test("validate manually", () => {
    const rules: Rule<string, any>[] = [
        email(),
    ]

    const fieldConfig: FieldConfig<any> = {
        init: "",
        rules,
        validateOn: ["submit"],
    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()

    bindChangeEvent(field, setForm)
    bindValidation({
        $form,
        submitEvent: submit,
        field,
        rules,
        fieldValidationEvents: ["submit"],
        formValidationEvents: ["submit"],
    })

    field.onChange("123")

    expect(field.$value.getState()).toBe("123")
    expect(field.$firstError.getState()).toBeNull()

    field.validate()
    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "123",
    })

    field.onChange("1234")

    expect(field.$firstError.getState()).toBeNull()

})

test("reset errors", () => {
    const rules: Rule<string, any>[] = [
        email(),
    ]

    const fieldConfig: FieldConfig<any> = {
        init: "",
        rules,
        validateOn: ["submit"],
    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()

    bindChangeEvent(field, setForm)
    bindValidation({
        $form,
        submitEvent: submit,
        field,
        rules,
        fieldValidationEvents: ["submit"],
        formValidationEvents: ["submit"],
    })

    field.onChange("123")
    submit()

    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "123",
    })

    field.resetErrors()

    expect(field.$firstError.getState()).toBeNull()
})

