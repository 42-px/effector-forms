# Effector forms

- [Motivation](#motivation)
- [Setup](#setup)
- [Usage](#usage)
- [Connect to view via useUnit](#connect-to-view-via-useunit)
- [useField](#usefield)
- [Form state](#form-state)
- [Submit Filter](#submit-filter)
- [Set form](#set-form)
- [Set initial form](#setInitialForm)
- [Validation triggers](#validation-triggers)
- [Interdependent validations](#interdependent-validations)
- [Usage with domain](#usage-with-domain)
- [Rules](#rules)
- [Use rules factory](#use-rules-factory)
- [isDirty & isTouched](#isdirty---istouched)
- [Show errors](#show-errors)
- [Use external validators lib](#use-external-validators-lib)
  * [Usage with Yup](#usage-with-yup)
- [Add custom error manually](#add-custom-error-manually)
- [Bulk errors](#bulk-errors)
- [Validate by external source](#validate-by-external-source)
- [Validate manually](#validate-manually)
- [Reset form](#reset-form)
- [Reset values only](#reset-values-only)
- [Reset errors](#reset-errors)
- [Register form (full example)](#register-form--full-example-)
- [Typescipt users tips](#typescipt-users-tips)
- [Advanced](#advanced)
  * [Use external units](#use-external-units)
- [Effector 21](#effector-21)


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

If you also need validation, it really hurts. This library was created to improve the "form experience" in an effector application by generating form state from declarative configuration. 

The library comes with hooks for react/react-native, however you can use it with VueJS or Forest as well (in the case of VueJS, you have to connect it to the view layer yourself). 

**Good typescript support!** :heart: :v: :+1:

## Setup

If you are using **SSR**, add effector-forms to the babel plugin config

```json
{
  "plugins": [
    [
      "effector/babel-plugin",
      {
        "factories": [
          "effector-forms"
        ]
      }
    ]
  ],
}
```

## Usage

Model:
```ts
import { restore, forward, createEffect } from "effector"
import { createForm } from 'effector-forms'

export const loginForm = createForm({
    fields: {
        email: {
            init: "", // field's store initial value
            rules: [
                {
                    name: "email",
                    validator: (value: string) => /\S+@\S+\.\S+/.test(value)
                },
            ],
        },
        password: {
            init: "", // field's store initial value
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

export const loginFx = createEffect()

forward({
    from: loginForm.formValidated,
    to: loginFx,
})
```

The **createForm** factory creates stores and events of the form and binds them by declarative configuration. **formValidated** effector event will be triggered when the form is submitted (if all its fields are valid). Option **validateOn** sets an array of triggers by which the form values ​​will be validated. Possible conditions: submit, blur, change. The value of each field and validation errors are stored in effector stores.

After we have created the form, we can connect it to the view using the **useForm** hook:

```tsx
import { useForm } from 'effector-forms'
import { useStore } from 'effector-react'
import { loginForm, loginFx } from '../model'

export const LoginForm = () => {
  const { fields, submit, eachValid } = useForm(loginForm)
  const pending = useStore(loginFx.pending)

  const onSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  return (
    <form onSubmit={onSubmit)}>
        <input
            type="text"
            value={fields.email.value}
            disabled={pending}
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
            disabled={pending}
            onChange={(e) => fields.password.onChange(e.target.value)}
        />
        <div>
            {fields.password.errorText({
                "required": "password required"
            })}
        </div>
        <button
          disabled={!eachValid || pending}
          type="submit"
        >
          Login
        </button>
    </form>
  )
}
```

## Connect to view via useUnit

The effector-forms entities implement the **@@unitShape** protocol! This means that instead of **useForm** and **useField** hooks, you can connect the form to the view via "useUnit".

React's example:
```tsx
import { useUnit } from "effector-react"
import { createForm } from 'effector-forms'


const loginForm = createForm({
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
  const email = useUnit(loginForm.fields.email)
  const password = useUnit(loginForm.fields.password)
  const form = useUnit(loginForm)

  const submitHandler = (e) => {
    e.preventDefault()
    form.submit()
  }

  return (
    <form onSubmit={submitHandler}>
      <input
          type="text"
          value={email.value}
          onChange={(e) => email.onChange(e.target.value)}
      />
      <input
          type="password"
          value={password.value}
          onChange={(e) => password.onChange(e.target.value)}
      />
    </form>
  )
}
```

## useField

```tsx
import { createForm, useField } from 'effector-forms'

export const form = createForm({
  fields: {
    email: {
      init: "",
      rules: emailRules,
    },
    password: {
      init: "",
      rules: passwordRules,
    },
  },
})

const Email = () => {
  const { value, onChange } = useField(form.fields.email)

  return (
    <input
      type="text"
      placeholder="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

const Password = () => {
  const { value, onChange } = useField(form.fields.password)
  
  return (
    <input
      type="password"
      placeholder="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

const Form = () => {
  const onSubmit = (e) => {
    e.preventDefault()
    form.submit()
  }


  <form onSubmit={onSubmit}>
    <Email />
    <Password />
    <button type="submit">Login</button>
  </form>
}
```

## Form state

You can access the state of fields, form and its events directly in the model:

```ts
const form = createForm(formConfig)

form.fields.email.$value.watch(() => {
  console.log("username field changed")
})

form.fields.email.$errors.watch((errors) => {
  console.log(errors)
})

form.$values.watch(() => {
  console.log("form changed")
})

form.$eachValid.watch((eachValid) => {
  if (eachValid) {
    console.log("form valid")
  }
})

form.fields.email.onChange("value")

forward({
  from: form.fields.email.onChange,
  to: someEvent,
})
```

## Submit Filter

Sometimes we need to prevent form submission conditionally, for example if we have an error from the server. 
To do this, you can use the **filter** option by passing a boolean Store:

```ts
export const loginFx = createEffect()
const $serverError = restore(loginFx.failData, null)


export const loginForm = createForm({
    filter: $serverError.map((error) => error === null),
    fields,
    validateOn: ["submit"],
})

$serverError.reset(form.$values.updates)

forward({
    from: form.formValidated,
    to: loginFx,
})
```


In this example the **formValidated** event will be triggered after submit only if the **$serverError** is null & form is valid.


## Set form

It is often necessary to set the value of the form by an event. This is useful for initializing initial field values. In this case you can use **setForm** event:


```ts
type User = {
  username: string
  about?: string
  birhDate?: string
}

const getUserProfileFx = createEffect<void, User, Error>()

const form = createForm({
  fields: {
    username: {
      init: "" as string,
    },
    about: {
      init: "" as string,
    },
    birthDate: {
      init: null as string | null,
    },
  },
})

forward({
  from: getUserProfileFx.doneData,
  to: form.setForm,
})
```

## setInitialForm

In case you get values from the backend, use the `form.setInitialForm` event instead of `form.setForm`. This event changes both the value and the initial values. The `$isDirty` flag will be false.


## Validation triggers

You can validate different form fields against different triggers:

```tsx
const form = createForm({
  validateOn: ["submit"],
  fields: {
    email: {
      init: "",
      rules: emailRulesArr,
      validateOn: ["blur"],
    },
    username: {
      init: "",
      rules: usernameRulesArr,
    },
    password: {
      init: "",
      rules: passwordRulesArr,
      validateOn: ["change"],
    },
  },
})

const RegisterForm = () => {
  const { submit, fields } = useForm(form)

  const onSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="email"
        value={fields.email.value}
        onBlur={() => fields.email.onBlur()}
        onChange={(e) => fields.email.onChange(e.target.value)}
      />
      <input
        type="text"
        placeholder="username"
        value={fields.username.value}
        onChange={(e) => fields.username.onChange(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={fields.password.value}
        onChange={(e) => fields.password.onChange(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  )
}
```


In this example:
* the email field will be validated on blur and submit
* the password field will be validated on change and submit
* the username field will be validated on submit only

Note that you must directly trigger the onBlur event on the email field. This is due to the fact that the form state is separated from the view, and the form state "knows nothing" about input field event.


You can also pass multiple triggers:
```ts
const form = createForm({
  validateOn: ["submit", "blur"],
  fields: formFields,
})
```


## Interdependent validations

It so happens that to validate a field, you need to know the value of another field. In this case you can use the second argument of the validator function:

```ts
const form = createForm({
  fields: {
    email: {
      init: "",
      rules: emailRules,
    },
    password: {
      init: "",
      rules: passwordRules,
    },
    confirmation: {
      init: "",
      rules: [
        {
          name: "confirmation",
          validator: (confirmation, { password }) => confirmation === password
        },
      ],
    },
  }
})

```


## Usage with domain


If you need to have all units of a form (fields stores and events) in a domain, you can pass the domain option. This can be useful for SSR.

```ts
const myDomain = createDomain()
const form = createForm({
  domain: myDomain,
  fields: formFields,
})
```

## Rules

Validation rule is an object with name and validator properties:

```ts
{
  name: "required",
  validator: (value) => Boolean(value),
}
```

To reuse validation rules, put them in a separate module. Very often the validator needs a parameter. For this reason, we recommend using "factory-style" when creating your validators library:

```ts
export const rules = {
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => Boolean(value),
    }),
    email: (): Rule<string> => ({
        name: "email",
        validator: (value) => /\S+@\S+\.\S+/.test(value)
    }),
    minLength: (min: number): Rule<string> => ({
        name: "minLength",
        validator: (value) => value.length >= min 
    }),
    maxLength: (max: number): Rule<string> => ({
        name: "maxLength",
        validator: (value) => value.length <= max 
    }),
}
```

```ts
import { rules } from 'my-validation-rules'

const form = createForm({
  fields: {
    email: {
      init: "",
      rules: [
        rules.email(),
      ],
    },
    password: {
      init: "",
      rules: [
        rules.required(),
        rules.minLength(3),
      ],
    },
  },
})
```

## Use rules factory

Sometimes you need to calculate validation rules based on the current state of the form.
In this case, you can pass a factory function to rules:

```ts
const form = createForm({
    fields: {
        needNotification: {
            init: false,
            rules: [],
        },
        email: {
            init: "" as string,
            rules: (value: string, form) => form.needNotification ? [email()] : [],
        },
    },
    validateOn: ["submit"],
})
```


## isDirty & isTouched

Each field has two boolean stores: $isTouched and $isDirty.

*$isTouched* true if this field has ever changed (the onChange event has been called at least once). false otherwise.

*isDirty* true if the current value is different from the initial (===). false otherwise.

Both fields are reset on form.reset event.

```ts
const form = createForm({
  fields: {
    email: {
      init: "email@example.com",
      rules: [
        rules.required(),
      ],
    },
  }
})

form.fields.email.onChange("")
console.log(form.fields.email.$isTouched.getState()) // true
console.log(form.fields.email.$isDirty.getState()) // true

form.fields.email.onChange("email@example.com")
console.log(form.fields.email.$isTouched.getState()) // true
console.log(form.fields.email.$isDirty.getState()) // false

form.reset()
console.log(form.fields.email.$isTouched.getState()) // false
console.log(form.fields.email.$isDirty.getState()) // false
```

[Sandbox](https://codesandbox.io/s/sad-wildflower-0hjc9?file=/src/App.js)

## Show errors

You can use two different approaches to output error text

1. Define the error text in the validator function
2. Define error text in the view layer (components)


In the first approach returns an object instead of a boolean from the validator function:

```ts
const rules = {
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => ({
            isValid: Boolean(value),
            errorText: "Required field",
        }),
    }),
}


const form = createForm({
  fields: {
    username: {
      init: "",
      rules: [
        rules.required(),
      ],
    }
  }
})
```

The error text can be displayed using the errorText helper:

```tsx
const Form = () => {
  const { fields, hasError, errorText } = useForm(form)

  return (
    <form>
      <input
        type="text"
        placeholder="username"
        className={hasError("username") ? "invalid" : ""}
        value={fields.username.value}
        onChange={(e) => fields.username.onChange(e.target.value)}
      />
      <div class="error-text">
        {errorText("username")}
      </div>
    </form>
  )
}
```


Alternatively, you can define the error text by passing the second argument to the errorText helper:

```tsx
const rules = {
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => Boolean(value),
    }),
}


const form = createForm({
  fields: {
    username: {
      init: "",
      rules: [
        rules.required(),
      ],
    }
  }
})

const Form = () => {
  const { fields, hasError, errorText } = useForm(form)

  return (
    <form>
      <input
        type="text"
        placeholder="username"
        className={hasError("username") ? "invalid" : ""}
        value={fields.username.value}
        onChange={(e) => fields.username.onChange(e.target.value)}
      />
      <div class="error-text">
        {errorText("username", {
          "required": "username field is required"
        })}
      </div>
    </form>
  )
}
```


You can also combine both approaches by overriding errors of only certain rules in the second argument errorText.

## Use external validators lib

You can implement your own validation rules or wrap an external rules library, for example [validator.js](https://www.npmjs.com/package/validator)

```ts
import { Rule } from 'effector-forms'
import isEmail from 'validator/lib/isEmail'

function createRule<Value>(
  name: string,
  validator: (v: any) => boolean
): Rule<Value> => ({
  name,
  validator
})

export const rules = {
  email: = () => createRule("email", isEmail)
}
```

### Usage with Yup
yup validation wrapper:
```ts
import * as yup from 'yup'

export function createRule<V, T = any>({
    schema,
    name,
}: { schema: yup.Schema<T>, name: string }): Rule<V> {
    return {
        name,
        validator: (v: V) => {
            try {
                schema.validateSync(v)
                return {
                    isValid: true,
                    value: v,
                }
            } catch (err) {
                return {
                    isValid: false,
                    value: v,
                    errorText: err.message,
                }
            }
        },
    }
}
```

use it with your form:
```ts
import * as yup from 'yup'
import { createForm } from 'effector-forms'
import { createRule } from '@/lib/create-yup-rule'


const form = createForm({
    fields: {
        email: {
            init: "",
            rules: [
                createRule<string>({
                    name: 'email',
                    schema: yup.string().email().required(),
                })
            ],
        },
        password: {
            init: "",
            rules: [
                createRule<string>({
                    name: "password",
                    schema: yup.string().required().min(3),
                })
            ],
        },
    },
})

```

## Add custom error manually

Sometimes you need to add an error manually. To do this, you can use the addError event on the field:
```ts
const form = createForm({
  fields: {
    username: {
      init: "",
    },
  },
})

const somethingHappened = createEvent()

forward({
  from: somethingHappened.map(() => ({
    rule: "my-custom",
    errorText: "somethingHappened",
  })),
  to: form.fields.addError,
})
```

you can use this to add a server error to the field:

```ts
const loginFx = createEffect<{ email: string, password: string }, void, Error>()

const loginForm = createForm({
  fields: {
    email: {
      init: "",
    },
    password: {
      init: "",
    },
  },
})

guard({
  source: loginFx.failData.map(
    (error) => error.name === "already-exists" ? { rule: "already-exists" } : null
  ),
  filter: Boolean,
  target: loginForm.fields.email.addError,
})
```

## Bulk errors

You can add multiple errors for many fields at once with the form.addErrors event:

```ts
guard({
  clock: loginFx.failData.map(
    (errors) => errors.map((err) => ({
      field: err.field,
      rule: "backend",
      errorText: err.msg,
    }))
  ),
  filter: (errors) => errors.length > 0,
  target: loginForm.addErrors,
})
```

## Validate by external source

You can pass external store to the validation rule. This storage will be available in the validator function:

```ts
const loginForm = createForm({
  fields: {
    email: {
      init: "",
      rules: [
        {
          name: "required_if",
          source: $needToValidate,
          validator: (value, form, needToValidate) => {
            if (!needToValidate) return true
            return Boolean(value)
          }
        },
      ],
    },
  },
})
```


## Validate manually

Use the **validate** event to manually validate the field at any time:

```ts
const form = createForm({
  fields: {
    username: {
      init: "",
    },
  },
})

const somethingHappened = createEvent()

forward({
  from: somethingHappened,
  to: form.fields.username.validate,
})
```

Validate all fields:

```ts
forward({
  from: somethingHappened,
  to: form.validate,
})
```

## Reset form
You can reset some field value or all fields:
```ts
const form = createForm(formConfig)

// reset specific field
form.fields.email.reset()

// reset form
form.reset()
```


form.reset event resets both values ​​and errors

## Reset values only
```ts
const form = createForm(formConfig)
form.resetValues()
```

## Reset errors

You can manually reset any field validation errors:
```ts
const form = createForm({
  fields: {
    email: {
      init: "",
      rules: emailRules,
    },
  },
})

form.fields.username.onChange("invalid email")
form.submit()
form.fields.username.resetErrors()
```

Reset forms errors (all fields):
```ts
const form = createForm({
  fields: {
    email: {
      init: "",
      rules: emailRules,
    },
    password: {
      init: "",
      rules: passwordRules,
    },
  },
})

form.fields.username.onChange("invalid email")
form.fields.username.onChange("invalid password")
form.resetErrors() // clear all errors
```


## Register form (full example)

Rules:
```ts
import { Rule } from 'effector-forms'

export const rules = {
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => Boolean(value),
    }),
    email: (): Rule<string> => ({
        name: "email",
        validator: (value) => /\S+@\S+\.\S+/.test(value)
    }),
    minLength: (min: number): Rule<string> => ({
        name: "minLength",
        validator: (value) => value.length >= min 
    }),
}
```


Model:
```ts
import { restore, createEffect } from 'effector'
import { createForm } from 'effector-forms'
import { rules } from '@/validation-rules'


export const registerFx = createEffect<{ email: string, password: string }, void, Error>()
const $registerError = restore(registerFx.failData, null)

export const registerForm = createForm({
    fields: {
        email: {
            init: "",
            rules: [
                rules.email(),
            ],
            validateOn: ["blur"],
        },
        password: {
            init: "",
            rules: [
                rules.required(),
                rules.minLength(3),
            ],
        },
        confirm: {
            init: "",
            rules: [
                {
                    name: "passwords-equal",
                    validator: (value: string, { password }) => {
                        return value === password
                    },
                },
            ],
            validateOn: ["change"],           
        },
    },
    validateOn: ["submit"],
})

$registerError.reset(registerForm.$values.updates)

forward({
    from: registerForm.formValidated,
    to: registerFx,
})
```

View:
```tsx
import { useStore } from 'effector'
import { useForm } from 'effector-forms'
import { registerForm, registerFx } from '../model'

const RegisterForm = () => {
  const pending = useStore(registerFx.pending)
  const { submit, fields, eachValid } = useForm(form)

  const onSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="email"
        value={fields.email.value}
        onBlur={() => fields.email.onBlur()}
        disabled={pending}
        onChange={(e) => fields.email.onChange(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={fields.password.value}
        disabled={pending}
        onChange={(e) => fields.password.onChange(e.target.value)}
      />
      <input
        type="text"
        placeholder="confirm"
        value={fields.confirm.value}
        disabled={pending}
        onChange={(e) => fields.confirm.onChange(e.target.value)}
      />
      <button type="submit" disabled={pending || !eachValid}>
        Register
      </button>
    </form>
  )
}
```

## Typescipt users tips


Types for stores and events generated by the createForm factory are inferred by the passed form configuration. Type inference is based on "init" field type and validator type. If you do not specify the type of the argument in the validator, the type of the resulting field may not be desired. For example:

```ts
const form = createForm({
  fields: {
    username: {
      init: "",
      rules: [
        {
          name: "required",
          validator: (value) => Boolean(value),
        },
      ],
    }
  },
})

const $usernameVal = form.fields.username.$value
```

the type of $usernameVal is ```Store <"">```, not ```Store<string>```. This happens because the empty string is inferred as a "string literal", not a "string".

To avoid such problems, cast init to the desired type or define the type of validator first argument:
```ts
const form = createForm({
  fields: {
    username: {
      init: "" as string,
      rules: [
        {
          name: "required",
          validator: (value) => Boolean(value),
        },
      ],
    }
  },
})

const $usernameVal = form.fields.username.$value // Store<string>
```
```ts
const form = createForm({
  fields: {
    username: {
      init: "",
      rules: [
        {
          name: "required",
          validator: (value: string) => Boolean(value),
        },
      ],
    }
  },
})

const $usernameVal = form.fields.username.$value // Store<string>
```

## Advanced

### Use external units

By default, **createForm** factory creates all form units (stores & events). Sometimes there is a need to pass externally created form units. In this case, **createForm** just binds them and creates combine units:

```ts
import { createForm, ValidationError } from 'effector-forms'

const form = createForm({
  fields: {
    email: {
        init: "",
        rules: [],
        units: {
          // all units are optional
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
        },
    },
  },
  units: {
    // all units are optional
    submit: createEvent(),
    reset: createEvent(),
    resetTouched: createEvent(),
    formValidated: createEvent<{ email: string }>(),
    setForm: createEvent<{ email?: string }>(),
  },
  validateOn: ["submit"],
})
```

## Effector 21

Effector 21 is no longer supported. For Effector 21 we recommend using version **0.0.24**.

```
npm i effector-forms@0.0.24
```

For effector-forms v0.0.24 together with effector 21 use import
```ts
import { createForm } from "effector-forms/legacy"
```


For effector-forms < 0.0.24 with effector 21, use the normal import:
```ts
import { createForm } from "effector-forms"
```

SSR support with effector 21 is not available. 



