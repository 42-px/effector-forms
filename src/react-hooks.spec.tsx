import * as React from "react"
import { render } from "@testing-library/react"
import { createForm } from "./factory"
import { useForm } from "./react-hooks"
import { Rule } from "./types"

const rules = {
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => Boolean(value),
    }),
    email: (): Rule<string> => ({
        name: "email",
        validator: (value) => ({
            isValid: /\S+@\S+\.\S+/.test(value),
            errorText: "invalid email"
        })
    }),
    minLength: (min: number): Rule<string> => ({
        name: "minLength",
        validator: (value) => value.length >= min
    }),
}

test("use form", (done) => {
    const form = createForm({
        fields: {
            email: {
                init: "invalid email value",
                rules: [
                    rules.email(),
                ],
            },
            password: {
                init: "valid password",
                rules: [
                    rules.required(),
                ],
            },
        },
        validateOn: ["submit"],
    })

    form.submit()

    const LoginForm = () => {
        const {
            fields,
            values,
            hasError,
            eachValid,
            errors,
            error,
            errorText,
        } = useForm(form)

        expect(values).toEqual({
            email: "invalid email value",
            password: "valid password",
        })
        expect(hasError()).toBe(true)
        expect(hasError("email")).toBe(true)
        expect(hasError("password")).toBe(false)
        expect(eachValid).toBe(false)
        expect(errors("email")).toEqual([
            {
                rule: "email",
                value: "invalid email value",
                errorText: "invalid email",
            },
        ])
        expect(errors("password")).toEqual([])
        expect(error("email")).toEqual({
            rule: "email",
            value: "invalid email value",
            errorText: "invalid email",
        })
        expect(error("password")).toBeNull()
        expect(errorText("email")).toBe("invalid email")
        expect(errorText("password")).toBe("")
        expect(errorText("email", {
            "email": "override error text"
        })).toBe("override error text")
        expect(fields.email.value).toBe("invalid email value")
        expect(fields.email.name).toBe("email")
        expect(fields.email.errors).toEqual([
            {
                rule: "email",
                value: "invalid email value",
                errorText: "invalid email",
            },
        ])
        expect(fields.email.firstError).toEqual({
            rule: "email",
            value: "invalid email value",
            errorText: "invalid email",
        })
        expect(fields.email.errorText()).toBe("invalid email")
        expect(fields.email.errorText({
            "email": "override error text"
        })).toBe("override error text")

        done()

        return null
    }


    render(<LoginForm />)

})
