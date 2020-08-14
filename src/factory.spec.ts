import { restore, forward, createEffect } from "effector"
import { createForm } from "./factory"
import { Rule } from "./types"

const rules = {
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

test("simple login form", () => {
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
                    rules.required()
                ],
            },
        },
        validateOn: ["submit"],
    })

  
    const validated = jest.fn()
    form.formValidated.watch(validated)

    form.fields.email.onChange("test")
    expect(form.fields.email.$errors.getState()).toEqual([])
    expect(form.fields.password.$errors.getState()).toEqual([])
    expect(form.$eachValid.getState()).toBe(true)
    expect(form.$values.getState()).toEqual({ email: "test", password: "" })

    form.submit()
    expect(form.$eachValid.getState()).toBe(false)
    expect(validated.mock.calls.length).toBe(0)
    expect(form.fields.email.$firstError.getState()).toEqual({
        rule: "email",
        value: "test",
    })
    expect(form.fields.password.$firstError.getState()).toEqual({
        rule: "required",
        value: "",
    })

    form.fields.email.onChange("test@gma")
    expect(form.fields.email.$firstError.getState()).toBeNull()
    expect(form.$eachValid.getState()).toBe(false)
    
    form.submit()
    expect(form.$eachValid.getState()).toBe(false)
    expect(form.fields.email.$firstError.getState()).toEqual({
        rule: "email",
        value: "test@gma",
    })

    form.fields.email.onChange("test@gmail.com")
    form.fields.password.onChange("123")
    expect(form.$eachValid.getState()).toBe(true)

    form.submit()
    expect(form.fields.email.$firstError.getState()).toBeNull()
    expect(form.fields.password.$firstError.getState()).toBeNull()
    expect(form.$eachValid.getState()).toBe(true)
    expect(validated.mock.calls.length).toBe(1)
    expect(form.$values.getState()).toEqual({
        email: "test@gmail.com",
        password: "123"
    })
})


test("register form", () => {
    const form = createForm({
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
                        name: "equal",
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

    const validated = jest.fn()

    form.formValidated.watch(validated)


    form.fields.password.onChange("123")
    expect(form.$eachValid.getState()).toBe(true)

    form.fields.email.onChange("test")
    expect(form.$eachValid.getState()).toBe(true)
    form.fields.email.onBlur()
    expect(form.$eachValid.getState()).toBe(false)
    form.fields.email.onChange("test@example.com")
    expect(form.$eachValid.getState()).toBe(true)

    form.fields.password.onChange("123")
    expect(form.$eachValid.getState()).toBe(true)
    form.fields.confirm.onChange("12")
    expect(form.$eachValid.getState()).toBe(false)
    form.fields.confirm.onChange("123")
    expect(form.$eachValid.getState()).toBe(true)
    expect(validated.mock.calls.length).toBe(0)

    form.submit()
    expect(form.$eachValid.getState()).toBe(true)
    expect(form.$values.getState()).toEqual({
        email: "test@example.com",
        password: "123",
        confirm: "123",
    })
    expect(validated.mock.calls.length).toBe(1)
})

test("set form", () => {
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
                    rules.required()
                ],
            },
        },
        validateOn: ["submit"],
    })

    form.setForm({
        email: "test@example.com"
    })
    expect(form.$values.getState()).toEqual({
        email: "test@example.com",
        password: "",
    })
    form.setForm({
        password: "123",
    })
    expect(form.$values.getState()).toEqual({
        email: "test@example.com",
        password: "123",
    })
})

test("with submit effect", (done) => {
  type Credentials = {
    email: string
    password: string
  }
  const loginFx = createEffect<Credentials, void, Error>({
      handler: ({ email }) => {
          if (email === "test@example.com") {
              return Promise.reject(new Error("already exists"))
          }
          return Promise.resolve()
      }
  })
  const $serverError = restore(loginFx.failData, null)

  const form = createForm({
      filter: $serverError.map((error) => error === null),
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
                  rules.required()
              ],
          },
      },
      validateOn: ["submit"],
  })

  $serverError.reset(form.$values.updates)

  forward({
      from: form.formValidated,
      to: loginFx,
  })


  const validated = jest.fn()
  form.formValidated.watch(validated)

  form.fields.email.onChange("test@example.com")
  form.fields.password.onChange("1234")
  
  form.submit()
  expect(validated.mock.calls.length).toBe(1)
  expect(form.$eachValid.getState()).toBe(true)

  loginFx.fail.watch(() => {
      form.submit()
      form.submit()
      expect(validated.mock.calls.length).toBe(1)

      form.fields.email.onChange("test1@example.com")

      loginFx.done.watch(() => done())
      form.submit()
      expect(validated.mock.calls.length).toBe(2)
  })
})
