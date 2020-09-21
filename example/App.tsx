import * as React from 'react'
import { createForm, Rule, useForm } from '../dist'

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
    validator: (value) => value.length >= min 
  }),
}



const registerForm = createForm({
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

registerForm.formValidated.watch(() => {
  alert("form valid!")
})

const errorText = {
  fontSize: 12,
  color: 'red',
}

export const App = () => {
  const form = useForm(registerForm)

  const onSubmit = (e) => {
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
          value={form.fields.password.value}
          onChange={(e) => form.fields.password.onChange(e.target.value)}
        />
        {form.fields.password.hasError() && (
          <div style={errorText}>
            {form.fields.password.errorText({
              minLength: "min length error!",
            })}
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