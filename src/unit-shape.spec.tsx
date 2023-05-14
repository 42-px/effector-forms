import * as React from "react"
import { useUnit } from "effector-react"
import { render } from "@testing-library/react"
import { createForm } from "./factory"


test("unitShape for a form", (done) => {
    const form = createForm({
        fields: {
            email: {
                init: "",
                rules: [],
            },
            password: {
                init: "",
                rules: [],
            },
        },
        validateOn: ["submit"],
    })


    const LoginForm = () => {
        const {
            isValid,
            isDirty,
            touched,
            submit,
            validate,
            reset,
            addErrors,
            setForm,
            setInitialForm,
            resetTouched,
            resetValues,
            resetErrors,
            formValidated,
        } = useUnit(form)

        expect(isValid).toBe(true)
        expect(isDirty).toBe(false)
        expect(touched).toBe(false)
        expect(submit).toBeInstanceOf(Function)
        expect(validate).toBeInstanceOf(Function)
        expect(reset).toBeInstanceOf(Function)
        expect(addErrors).toBeInstanceOf(Function)
        expect(setForm).toBeInstanceOf(Function)
        expect(setInitialForm).toBeInstanceOf(Function)
        expect(resetTouched).toBeInstanceOf(Function)
        expect(resetValues).toBeInstanceOf(Function)
        expect(resetErrors).toBeInstanceOf(Function)
        expect(formValidated).toBeInstanceOf(Function)


        done()

        return null
    }


    render(<LoginForm />)
})


test("unitShape for a field", (done) => {
    const form = createForm({
        fields: {
            email: {
                init: "email@example.com",
                rules: [],
            },
        },
        validateOn: ["submit"],
    })


    const LoginForm = () => {
        const {
            value,
            initValue,
            isValid,
            isDirty,
            touched,
            errors,
            firstError,
            errorText,
            onChange,
            onBlur,
            addError,
            validate,
            reset,
            resetErrors,
            resetValue,
        } = useUnit(form.fields.email)

        expect(value).toBe("email@example.com")
        expect(initValue).toBe("email@example.com")
        expect(errors).toEqual([])
        expect(firstError).toBe(null)
        expect(errorText).toBe("")
        expect(isValid).toBe(true)
        expect(isDirty).toBe(false)
        expect(touched).toBe(false)

        expect(onChange).toBeInstanceOf(Function)
        expect(onBlur).toBeInstanceOf(Function)
        expect(addError).toBeInstanceOf(Function)
        expect(validate).toBeInstanceOf(Function)
        expect(reset).toBeInstanceOf(Function)
        expect(resetErrors).toBeInstanceOf(Function)
        expect(resetValue).toBeInstanceOf(Function)

        done()

        return null
    }


    render(<LoginForm />)
})
