# Effector form

## Motivation

If you working with forms in an Effector-application, there is often a lot of boilerplate code, such as:

```js
export const emailChanged = login.event()
export const passwordChanged = login.event()

export const submitForm = login.event()

export const $email = login.store('')
export const $password = login.store('')

export const $form = combine({
  password: $password,
  email: $email,
})

$email.on(emailChanged, (_, email) => email)
$password.on(passwordChanged, (_, password) => password)
```

If you also need validation, it really hurts. This library was created to improve the "form experience" in an effector application by generating form state from declarative configuration. **Good typescript support!**.


## Simple login form

Model:
```ts
import { restore, forward, createEffect } from "effector"
import { createForm } from 'effector-form'

export const loginFx = createEffect()
export const $serverError = restore(loginFx.failData, null)

export const loginForm = createForm({
    fields: {
        email: {
            init: "",
            rules: [
                {
                    name: "email",
                    validator: (value: string) => /\S+@\S+\.\S+/.test(value)
                },
            ],
        },
        password: {
            init: "",
            rules: [
              {
                name: "required",
                validator: (value: string) => Boolean(value),
              }
            ],
        },
    },
    validateOn: ["submit"],
})

forward({
    from: loginForm.formValidated,
    to: loginFx,
})

$serverError.reset(loginForm.$values.updates)
```

View
```tsx
import { useStore } from 'effector-react'
import { useForm } from 'effector-form'
import { loginForm, $serverError } from '../model'

export const LoginForm = () => {
  const serverError = useStore($serverError)
  const { fields, submit } = useForm(loginForm)

  return (
    <form onSubmit={() => submit()}>
        <div>
          {serverError.text}
        </div>
        <input
            type="text"
            value={fields.email.value}
            onChange={(e) => fields.email.onChange(e.target.value)}
        />
        <div>
            {fields.email.errorText({
                "email": "you must enter a valid email address",
            })}
        </div>
        <input
            type="password"
            value={fields.password.value}
            onChange={(e) => fields.password.onChange(e.target.value)}
        />
        <div>
            {fields.password.errorText({
                "required": "password required"
            })}
        </div>
        <button type="submit">Login</button>
    </form>
  )
}

```

## form values
## Domain
## Rules with error text
## Override error text
## Usage with rules lib
## Advanced
