# Effector forms

  * [Motivation](#motivation)
  * [Usage](#usage)
  * [useField](#usefield)
  * [Form state](#form-state)
  * [Submit Filter](#submit-filter)
  * [Set form](#set-form)
  * [Validation triggers](#validation-triggers)
  * [Interdependent validations](#interdependent-validations)
  * [Usage with domain](#usage-with-domain)
  * [Rules](#rules)
  * [Show errors](#show-errors)
  * [Use external validators lib](#use-external-validators-lib)
  * [Add custom error manually](#add-custom-error-manually)
  * [Validate manually](#validate-manually)
  * [Reset errors](#reset-errors)
  * [Register form (full example)](#register-form--full-example-)
  * [Typescipt users tips](#typescipt-users-tips)
  * [Coming soon](#coming-soon)

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
import { loginForm, loginFx } from '../model'

export const LoginForm = () => {
  const { fields, submit, eachValid } = useForm(loginForm)

  const onSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  return (
    <form onSubmit={onSubmit)}>
        <input
            type="text"
            value={fields.email.value}
            disabled={loginFx.pending}
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
            disabled={loginFx.pending}
            onChange={(e) => fields.password.onChange(e.target.value)}
        />
        <div>
            {fields.password.errorText({
                "required": "password required"
            })}
        </div>
        <button
          disabled={!eachValid || loginFx.pending}
          type="submit"
        >
          Login
        </button>
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

To reuse validation rules, put them in a separate module. Very often the validator needs a parameter. For this reason, we recommend using "facrory-style" when creating your validators library:

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
        name: "minLength",
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

## Show errors

You can use two different approaches to output error text

1. Define the error text in the validator function
2. Define error text in the view layer (components)


In the first approach returns an object instead of a boolean from the validator function:

```ts
const rules = [
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => ({
            isValid: Boolean(),
            errorText: "Required field",
        }),
    }),
]


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
const rules = [
    required: (): Rule<string> => ({
        name: "required",
        validator: (value) => Boolean(value),
    }),
]


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

export const rules = [
  email: = () => createRule("email", isEmail)
]
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
  to: form.fields.validate,
})
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

# Coming soon

* dynamic fields
* async (effect) validators
