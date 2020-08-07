import {
  Effect,
  Store,
  Domain,
  createStore
} from 'effector'

type UnknownObject<T = unknown> = {
  [key: string]: T
}

export type Validator<Value> = (v: Value) => boolean

export type Rule<Value> = {
  name: string;
  validator: Validator<Value>;
}

type InitFunc<Value> = () => Value

export type FieldConfig<Value> = {
  init: Value | InitFunc<Value>;
  rules?: Rule<Value>[];
  validateOn?: ValidationEvent;
}

type ValidationEvent = "submit" | "blur" | "change"

type FormConfig<Fields extends UnknownObject, Done, Fail, Error> = {
  fields: Fields;
  submitFx: Effect<Done, Fail, Error>;
  domain?: Domain; 
  validateOn?: ValidationEvent;
}

export function createFieldsStores<Fields extends UnknownObject>(fields: Fields, domain?: Domain) {
  let stores: {
    [K in keyof Fields]: Fields[K] extends FieldConfig<infer U> ? Store<U> : Fields[K]
  }

  for (const fieldName in fields) {
    if (!fields.hasOwnProperty(fieldName)) continue

    const field = fields[fieldName] as FieldConfig<any>
    const value = typeof field.init === "function"
      ? field.init()
      : field.init

    ;(stores as any)[fieldName] = domain
      ? domain.store<any>(value)
      : createStore<any>(value) 
  }

  return stores
}


export function createForm<Fields extends UnknownObject, Done, Fail, Error>(
  config: FormConfig<Fields, Done, Fail, Error>
) {
  const {
    domain,
    fields,
    submitFx,
    validateOn = "submit"
  } = config

  let f: {[K in keyof Fields]: Fields[K] extends FieldConfig<infer U> ? U : Fields[K]}
  


  return f
}


/*
const f = createForm({
  username: {
    init: "",
    rules: [
      {
        name: 'required',
        validator: (name: string) => Boolean(name), 
      }
    ],
  }
})
*/

// массивом лучше 