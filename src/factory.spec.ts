import { restore, forward, createEffect } from "effector"
import * as yup from "yup"
import { createForm } from "./factory"
import { Rule, ValidationError } from "./types"

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

test("filter", (done) => {
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

test("reset form", () => {
    const form = createForm({
        fields: {
            email: {
                init: "",
                rules: [
                    rules.required(),
                ],
            },
            password: {
                init: "",
                rules: [
                    rules.required()
                ],
            }
        },
    })

    form.fields.email.onChange("123")
    form.fields.password.onChange("123")

    expect(form.fields.email.$value.getState()).toBe("123")
    expect(form.fields.password.$value.getState()).toBe("123")

    form.fields.password.reset()
    expect(form.fields.password.$value.getState()).toBe("")
    expect(form.fields.email.$value.getState()).toBe("123")

    form.fields.password.onChange("123")
    form.reset()

    expect(form.fields.email.$value.getState()).toBe("")
    expect(form.fields.password.$value.getState()).toBe("")

})

test("use YUP", () => {
    function createRule<V, T = any>({
        schema,
        name,
    }: { schema: yup.Schema<T>; name: string }): Rule<V> {
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

    type ObjFeild = { a: string; b: string }

    const form = createForm({
        fields: {
            simpleField: {
                init: "",
                rules: [
                    createRule<string>({
                        name: "email",
                        schema: yup.string().email().min(3),
                    })
                ],
            },
            objField: {
                init: { a: "", b: "" },
                rules: [
                    createRule<ObjFeild>({
                        name: "obj",
                        schema: yup.object().shape({
                            a: yup.string().email().required(),
                            b: yup.string().required(),
                        })
                    })
                ],
            },
        },
    })

    form.fields.simpleField.onChange("invalid")
    form.fields.objField.onChange({ a: "email@example.com", b: "fd" })

    form.submit()

    expect(form.fields.simpleField.$firstError.getState()).toBeTruthy()
    expect(form.fields.objField.$firstError.getState()).toBeNull()

    form.fields.objField.onChange({ a: "invalid", b: "valid" })
    form.fields.simpleField.onChange("test@example.com")
    form.submit()

    expect(form.fields.simpleField.$firstError.getState()).toBeNull()
    expect(form.fields.objField.$firstError.getState()).toBeTruthy()
})
