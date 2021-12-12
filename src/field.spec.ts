import { createEvent, createStore, restore } from "effector"
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
    const resetForm = createEvent<void>()
    const resetTouched = createEvent<void>()
    const resetValues = createEvent<void>()

    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)
    
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
    const resetForm = createEvent<void>()
    const resetTouched = createEvent<void>()
    const resetFormErrors = createEvent<void>()
    const resetValues = createEvent<void>()
    const validateForm = createEvent<void>()

    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: resetForm,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules,
        validateFormEvent: validateForm,
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
    const resetForm = createEvent<void>()
    const resetFormErrors = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()

    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: resetForm,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules,
        validateFormEvent: validateForm,
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

test("filter input by store", () => {
    const setFilter = createEvent<boolean>()
    const $filter = restore(setFilter, false)


    const fieldConfig: FieldConfig<any> = {
        init: "",
        filter: $filter,

    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()
    const resetForm = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()

    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: resetForm,
        field,
        resetValues,
        resetErrors: resetFormErrors,
        validateFormEvent: validateForm,
        rules: [],
        fieldValidationEvents: [],
        formValidationEvents: ["submit"],
    })

    field.onChange("123")
    expect(field.$value.getState()).toBe("")
    setFilter(true)
    field.onChange("123")
    expect(field.$value.getState()).toBe("123")
})


test("filter input by func", () => {
    const fieldConfig: FieldConfig<any> = {
        init: "",
        filter: (v: string) => /^\d+$/.test(v),
    }

    const field = createField("numeric", fieldConfig)
    const $form = createStore<any>({ numeric: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()
    const resetForm = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()

    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: resetForm,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        validateFormEvent: validateForm,
        rules: [],
        fieldValidationEvents: [],
        formValidationEvents: ["submit"],
    })

    field.onChange("f")
    expect(field.$value.getState()).toBe("")
    field.onChange("1")
    expect(field.$value.getState()).toBe("1")
    field.onChange("12")
    expect(field.$value.getState()).toBe("12")
    field.onChange("12f")
    expect(field.$value.getState()).toBe("12")
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
    const reset = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()

    const resetTouched = createEvent<void>()

    bindChangeEvent(field, setForm, reset, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: reset,
        field,
        resetValues,
        resetErrors: resetFormErrors,
        validateFormEvent: validateForm,
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
    const reset = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()


    bindChangeEvent(field, setForm, reset, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: reset,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules,
        validateFormEvent: validateForm,
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
    const reset = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()


    bindChangeEvent(field, setForm, reset, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: reset,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules,
        validateFormEvent: validateForm,
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

test("isDirty & touched", () => {
    const fieldConfig: FieldConfig<any> = {
        init: "",
    }

    const field = createField("field", fieldConfig)
    const $form = createStore<any>({ field: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()
    const resetForm = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()


    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: resetForm,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules: [],
        validateFormEvent: validateForm,
        fieldValidationEvents: [],
        formValidationEvents: ["submit"],
    })

    expect(field.$isDirty.getState()).toBe(false)
    expect(field.$touched.getState()).toBe(false)

    field.onChange("123")
    expect(field.$isDirty.getState()).toBe(true)
    expect(field.$touched.getState()).toBe(true)

    field.onChange("")
    expect(field.$isDirty.getState()).toBe(false)
    expect(field.$touched.getState()).toBe(true)

    field.reset()
    expect(field.$isDirty.getState()).toBe(false)
    expect(field.$touched.getState()).toBe(false)

    field.onChange("123")
    expect(field.$isDirty.getState()).toBe(true)
    expect(field.$touched.getState()).toBe(true)

    resetTouched()
    expect(field.$isDirty.getState()).toBe(true)
    expect(field.$touched.getState()).toBe(false)
})


test("external units", () => {
    const units = {
        $value: createStore(""),
        $errors: createStore<ValidationError<string>[]>([]),
        $isTouched: createStore<boolean>(false),
        onChange: createEvent<string>(),
        changed: createEvent<string>(),
        onBlur: createEvent<void>(),
        addError: createEvent<{ rule: string; errorText?: string }>(),
        validate: createEvent<void>(),
        reset: createEvent<void>(),
        resetErrors: createEvent<void>(),
    }

    const fieldConfig: FieldConfig<any> = {
        init: "",
        units,
    }

    const field = createField("field", fieldConfig)
    expect(field.$value).toBe(units.$value)
    expect(field.$errors).toBe(units.$errors)
    expect(field.$isTouched).toBe(units.$isTouched)
    expect(field.onChange).toBe(units.onChange)
    expect(field.changed).toBe(units.changed)
    expect(field.onBlur).toBe(units.onBlur)
    expect(field.addError).toBe(units.addError)
    expect(field.validate).toBe(units.validate)
    expect(field.reset).toBe(units.reset)
    expect(field.resetErrors).toBe(units.resetErrors)
})


test("validate with source", () => {
    const validateOn: ValidationEvent[] = ["change"]
    const $needToValidateEmail = createStore(false)
    const setNeedToValidateFlag = createEvent<boolean>()

    $needToValidateEmail.on(setNeedToValidateFlag, (_, v) => v)

    const fieldConfig: FieldConfig<any> = {
        init: "" as string,
        rules: [
            {
                name: "required_if",
                source: $needToValidateEmail,
                validator: (value, _, needToValidateEmail) => {
                    return !needToValidateEmail || Boolean(value)
                }
            },
            email(),
        ],
        validateOn,
    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()
    const resetForm = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()

    bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: resetForm,
        resetValues,
        field,
        validateFormEvent: validateForm,
        resetErrors: resetFormErrors,
        rules: fieldConfig.rules || [],
        fieldValidationEvents: validateOn,
        formValidationEvents: ["submit"],
    })

    field.onChange("234@gmail.com")
    expect(field.$firstError.getState()).toBeNull()
    setNeedToValidateFlag(true)
    field.onChange("")

    expect(field.$firstError.getState()).toEqual({
        rule: "required_if",
        value: "",
    })

    setNeedToValidateFlag(false)
    field.onChange("234")
    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "234",
    })
})


test("reset value", () => {
    const rules = [
        {
            name: "required",
            validator: (v: string) => Boolean(v),
        },
    ]
    const fieldConfig: FieldConfig<any> = {
        init: "",
        rules,
        validateOn: ["change"],
    }

    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()
    const reset = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()

    bindChangeEvent(field, setForm, reset, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: reset,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules,
        validateFormEvent: validateForm,
        fieldValidationEvents: ["submit", "change"],
        formValidationEvents: ["submit"],
    })

    field.onChange("123")
    expect(field.$value.getState()).toBe("123")
    expect(field.$firstError.getState()).toBeNull()
    field.resetValue()
    expect(field.$value.getState()).toBe("")
    expect(field.$firstError.getState()).toEqual({
        rule: "required",
        value: "",
    })
})

test("reset errors by form event", () => {
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
    const reset = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()


    bindChangeEvent(field, setForm, reset, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: reset,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules,
        validateFormEvent: validateForm,
        fieldValidationEvents: ["submit"],
        formValidationEvents: ["submit"],
    })

    field.onChange("123")
    submit()

    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "123",
    })

    resetFormErrors()

    expect(field.$firstError.getState()).toBeNull()
})

test("pass rules factory", () => {
    const rules = (value: string) => {
        if (value.length > 3) {
            return [
                email(),
            ]
        } else {
            return []
        }
    }
  
    const fieldConfig: FieldConfig<any> = {
        init: "" as string,
        rules,
        validateOn: ["change"],
    }
  
    const field = createField("email", fieldConfig)
    const $form = createStore<any>({ email: "" })
    const setForm = createEvent<any>()
    const submit = createEvent<void>()
    const reset = createEvent<void>()
    const resetTouched = createEvent<void>()
    const validateForm = createEvent<void>()
    const resetValues = createEvent<void>()
    const resetFormErrors = createEvent<void>()
  
    bindChangeEvent(field, setForm, reset, resetTouched, resetValues)
    bindValidation({
        $form,
        submitEvent: submit,
        resetFormEvent: reset,
        resetValues,
        resetErrors: resetFormErrors,
        field,
        rules,
        validateFormEvent: validateForm,
        fieldValidationEvents: ["submit", "change"],
        formValidationEvents: ["submit"],
    })
  
    field.onChange("12")
    expect(field.$value.getState()).toBe("12")
    expect(field.$firstError.getState()).toBeNull()
    field.onChange("1234")
    expect(field.$firstError.getState()).toEqual({
        rule: "email",
        value: "1234",
    })
    field.onChange("12")
    expect(field.$firstError.getState()).toBeNull()
})
