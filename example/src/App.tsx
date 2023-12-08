/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { createForm, Rule, useForm } from "effector-forms"
import { createDomain, createEvent } from "effector"
import { useUnit } from "effector-react"

const rules = {
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => ({
            isValid: Boolean(value),
            errorText: "Required field",
        }),
    }),
    email: (): Rule<string> => ({
        name: "email",
        validator: (value) => ({
            isValid: /\S+@\S+\.\S+/.test(value),
            errorText: `${value} is not a valid email`,
        }),
    }),
    minLength: (min: number): Rule<string> => ({
        name: "minLength",
        validator: (value) => ({
            isValid: value.length >= min,
            errorText: `minLength is ${min}`,
        })
    }),
}

const initForm = createEvent<void>()


const registerForm = createForm({
    domain: createDomain(),
    fields: {
        email: {
            init: "" as string,
            rules: [
                rules.required(),
                rules.email(),
            ],
            validateOn: ["change"],
        },
        password: {
            init: "" as string,
            rules: [
                rules.required(),
                rules.minLength(3),
            ],
        },
        confirm: {
            init: "" as string,
            rules: [
                {
                    name: "confirm",
                    validator: (confirm, { password }) => confirm === password,
                    errorText: "password mismatch"
                },
            ],
        },
    },
    validateOn: ["submit"],
})

/*
sample({
    clock: initForm,
    fn: () => ({
        email: "myemail@example.com"
    }),
    target: registerForm.setInitialForm,
})
*/

registerForm.formValidated.watch(() => {
    alert("form valid!")
})

const errorText = {
    fontSize: 12,
    color: "red",
}

const newForm = createForm({
    fields: {
        email: {
            init: ""
        }
    }
})

console.log(registerForm.fields)
console.log(newForm.fields)


export const App = () => {
    const form = useForm(registerForm)
    const password = useUnit(registerForm.fields.password)

    const onSubmit = (e: any) => {
        e.preventDefault()
        form.submit()
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="text"
                    value={form.fields.email.value}
                    onChange={(e) => form.fields.email.onChange(e.target.value)}
                />
                {form.fields.email.hasError() && (
                    <div style={errorText}>
                        {form.fields.email.errorText({
                            minLength: "min length error!",
                        })}
                    </div>
                )}
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password.value}
                    onChange={(e) => password.onChange(e.target.value)}
                />
                {!password.isValid && (
                    <div style={errorText}>
                        {password.errorText}
                    </div>
                )}
            </div>
            <div>
                <label>Confirm</label>
                <input
                    type="password"
                    value={form.fields.confirm.value}
                    onChange={(e) => form.fields.confirm.onChange(e.target.value)}
                />
                {form.fields.confirm.hasError() && (
                    <div style={errorText}>
                        {form.fields.confirm.errorText({
                            minLength: "min length error!",
                        })}
                    </div>
                )}
            </div>
            <div>
                <button onClick={() => form.reset()} type="button">
                    Reset
                </button>
            </div>
            <div>
                <button type="submit">
                    Register
                </button>
            </div>
            <div>
                <button type="button" onClick={() => initForm()}>
                    Init form
                </button>
            </div>
            <div>
                <div>Is Email valid: {form.fields.email.isValid.toString()}</div>
                <div>Is Email dirty: {form.fields.email.isDirty.toString()}</div>
                <div>Is Email touched: {form.fields.email.isTouched.toString()}</div>
                <div>Is Password valid: {form.fields.password.isValid.toString()}</div>
                <div>Is Password dirty: {form.fields.password.isDirty.toString()}</div>
                <div>Is Password touched: {form.fields.password.isTouched.toString()}</div>
                <div>Is Confirm valid: {form.fields.confirm.isValid.toString()}</div>
                <div>Is Confirm dirty: {form.fields.confirm.isDirty.toString()}</div>
                <div>Is Confirm touched: {form.fields.confirm.isTouched.toString()}</div>
                <div>Is Form valid: {form.isValid.toString()}</div>
                <div>Is Form dirty: {form.isDirty.toString()}</div>
                <div>Is Form touched: {form.isTouched.toString()}</div>
            </div>

        </form>
    )
}
