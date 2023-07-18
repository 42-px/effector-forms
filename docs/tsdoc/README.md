effector-forms

# effector-forms

## Table of contents

### Factories

- [createForm](README.md#createform)

### Hooks

- [useField](README.md#usefield)
- [useForm](README.md#useform)

### Type Aliases

- [AnyFormValues](README.md#anyformvalues)
- [ExternalFieldUnits](README.md#externalfieldunits)
- [ExternalFormUnits](README.md#externalformunits)
- [FieldConfig](README.md#fieldconfig)
- [Form](README.md#form)
- [FormConfig](README.md#formconfig)
- [FormValues](README.md#formvalues)
- [Rule](README.md#rule)
- [RuleResolver](README.md#ruleresolver)
- [ValidationError](README.md#validationerror)
- [ValidationEvent](README.md#validationevent)
- [ValidationResult](README.md#validationresult)
- [Validator](README.md#validator)

## Factories

### createForm

▸ **createForm**<`Values`\>(`config`): [`Form`](README.md#form)<`Values`\>

This is the main factory in the library that creates
the forms shape according to the given configuration.

Do not try to pass a type in the Values generic! Form types are inferred automatically from the passed "fields" object

**`Example`**

```ts
const form = createForm({
     fields: {
         username: {
             init: "",
             rules: [
                 {
                     name: "required",
                     validator: (value: string) => Boolean(value)
                 }
             ]
         },
         bio: {
             init: "",
             rules: []
         }
     },
     validateOn: ["change"],
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`AnyFormValues`](README.md#anyformvalues) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`FormConfig`](README.md#formconfig)<`Values`\> | The form configuration object |

#### Returns

[`Form`](README.md#form)<`Values`\>

The shape of effector units

#### Defined in

[factory.ts:70](https://github.com/42-px/effector-forms/blob/5028150/src/factory.ts#L70)

## Hooks

### useField

▸ **useField**<`Value`\>(`field`): `ConnectedField`<`Value`\>

#### Type parameters

| Name |
| :------ |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `Field`<`Value`\> |

#### Returns

`ConnectedField`<`Value`\>

#### Defined in

[react-hooks.ts:46](https://github.com/42-px/effector-forms/blob/5028150/src/react-hooks.ts#L46)

___

### useForm

▸ **useForm**<`Values`\>(`form`): `Result`<`Values`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`AnyFormValues`](README.md#anyformvalues) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `form` | [`Form`](README.md#form)<`Values`\> |

#### Returns

`Result`<`Values`\>

#### Defined in

[react-hooks.ts:117](https://github.com/42-px/effector-forms/blob/5028150/src/react-hooks.ts#L117)

## Type Aliases

### AnyFormValues

Ƭ **AnyFormValues**: `Object`

KV containing form values

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[types.ts:195](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L195)

___

### ExternalFieldUnits

Ƭ **ExternalFieldUnits**<`Value`\>: `Object`

External units KV. By default,
each field unit is created when the [factory](README.md#createform) is
called. If you pass a unit here, it will be used
instead of creating a new unit

#### Type parameters

| Name |
| :------ |
| `Value` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `$errors?` | `Store`<[`ValidationError`](README.md#validationerror)<`Value`\>[]\> |
| `$initValue?` | `Store`<`Value`\> |
| `$isTouched?` | `Store`<`boolean`\> |
| `$value?` | `Store`<`Value`\> |
| `addError?` | `Event`<{ `errorText?`: `string` ; `rule`: `string`  }\> |
| `changed?` | `Event`<`Value`\> |
| `onBlur?` | `Event`<`void`\> |
| `onChange?` | `Event`<`Value`\> |
| `reset?` | `Event`<`void`\> |
| `resetErrors?` | `Event`<`void`\> |
| `resetValue?` | `Event`<`void`\> |
| `validate?` | `Event`<`void`\> |

#### Defined in

[types.ts:132](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L132)

___

### ExternalFormUnits

Ƭ **ExternalFormUnits**<`Values`\>: `Object`

External units KV. By default,
each form unit is created when the [factory](README.md#createform) is
called. If you pass a unit here, it will be used
instead of creating a new unit

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`AnyFormValues`](README.md#anyformvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addErrors?` | `Event`<`AddErrorPayload`[]\> |
| `formValidated?` | `Event`<`Values`\> |
| `reset?` | `Event`<`void`\> |
| `resetErrors?` | `Event`<`void`\> |
| `resetTouched?` | `Event`<`void`\> |
| `resetValues?` | `Event`<`void`\> |
| `setForm?` | `Event`<`Partial`<[`AnyFormValues`](README.md#anyformvalues)\>\> |
| `setInitialForm?` | `Event`<`Partial`<[`AnyFormValues`](README.md#anyformvalues)\>\> |
| `submit?` | `Event`<`void`\> |
| `validate?` | `Event`<`void`\> |

#### Defined in

[types.ts:225](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L225)

___

### FieldConfig

Ƭ **FieldConfig**<`Value`\>: `Object`

field configuration object

#### Type parameters

| Name |
| :------ |
| `Value` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter?` | `Store`<`boolean`\> \| `FilterFunc`<`Value`\> | A store or function that filters a field change when the onChange event is called. The value of the field changes only if the function returns true |
| `init` | `Value` \| `InitFieldValue`<`Value`\> | initial value. The type of this value is used to infer the type of the field. You can pass a function that returns an initial value. This function will be called once when the form is created |
| `rules?` | [`Rule`](README.md#rule)<`Value`\>[] \| [`RuleResolver`](README.md#ruleresolver)<`Value`, `any`\> | An array of validation rules. You can also pass a function instead of an array and define validation rules dynamically. This function will be called at the moment of validation and will take a field value and form value |
| `units?` | [`ExternalFieldUnits`](README.md#externalfieldunits)<`Value`\> | External units KV. |
| `validateOn?` | [`ValidationEvent`](README.md#validationevent)[] | Array of field-specific validation triggers |

#### Defined in

[types.ts:151](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L151)

___

### Form

Ƭ **Form**<`Values`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`AnyFormValues`](README.md#anyformvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `$eachValid` | `Store`<`boolean`\> |
| `$isDirty` | `Store`<`boolean`\> |
| `$isValid` | `Store`<`boolean`\> |
| `$meta` | `Store`<{ `isDirty`: `boolean` ; `isValid`: `boolean` ; `touched`: `boolean`  }\> |
| `$touched` | `Store`<`boolean`\> |
| `$values` | `Store`<`Values`\> |
| `@@unitShape` | () => `FormUnitShape`<`Values`\> |
| `addErrors` | `Event`<`AddErrorPayload`[]\> |
| `fields` | `FormFields`<`Values`\> |
| `formValidated` | `Event`<`Values`\> |
| `reset` | `Event`<`void`\> |
| `resetErrors` | `Event`<`void`\> |
| `resetTouched` | `Event`<`void`\> |
| `resetValues` | `Event`<`void`\> |
| `set` | `Event`<`Partial`<`Values`\>\> |
| `setForm` | `Event`<`Partial`<`Values`\>\> |
| `setInitialForm` | `Event`<`Partial`<`Values`\>\> |
| `submit` | `Event`<`void`\> |
| `validate` | `Event`<`void`\> |

#### Defined in

[types.ts:340](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L340)

___

### FormConfig

Ƭ **FormConfig**<`Values`\>: `Object`

The object that is passed to the [createForm](README.md#createform) factory

**`Example`**

```ts
const $passwordMinLength = createStore(3)

form = createForm({
   fields: {
     username: {
        init: "",
        rules: [
           {
             name: "required",
             validator: (value) => Boolean(value),
           }
        ],
     },
     password: {
        init: "",
        validateOn: ["change"],
        rules: [
           {
              name: "required",
              validator: (value) => Boolean(value),
           },
           {
              name: "minLength",
              source: $passwordMinLength,
              validator: (password, form, minLength) => ({
                 isValid: password.length > minLength,
                 errorText: `The password field must be longer than ${minLength} characters`
              })
           }
        ]
     },
     confirm: {
        init: "",
        validateOn: ["change"],
        rules: [
           {
             name: "required",
             validator: (value) => Boolean(value),
           },
           {
             name: "matchPassword",
             validator: (confirm, { password }) => ({
                isValid: confirm === password,
                errorText: "Doesn't match the password"
             }),
           }
        ]
     }
   },
   validateOn: ["submit"]
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`AnyFormValues`](README.md#anyformvalues) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain?` | `Domain` | If you pass a domain into this field, all units of the form will be in this domain |
| `fields` | `FormFieldConfigs`<`Values`\> | The keys of the object are the names of the fields, and the values are the [FieldConfig](README.md#fieldconfig) |
| `filter?` | `Store`<`boolean`\> | If store is passed the `formValidated` event will be called then the value of store will be true |
| `units?` | [`ExternalFormUnits`](README.md#externalformunits)<`Values`\> | External units KV. |
| `validateOn?` | [`ValidationEvent`](README.md#validationevent)[] | Trigger that will be used to validate the form. |

#### Defined in

[types.ts:298](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L298)

___

### FormValues

Ƭ **FormValues**<`Fields`\>: { [K in keyof Fields]: Fields[K] extends Field<infer U\> ? U : never }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends `AnyFields` |

#### Defined in

[types.ts:199](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L199)

___

### Rule

Ƭ **Rule**<`Value`, `Form`, `Source`\>: `Object`

Validation rule that is passed to the
[field](README.md#fieldconfig) configuration

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Form` | `any` |
| `Source` | `any` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errorText?` | `string` | Optional field with the error text. This text will also be passed to the error [object](README.md#validationerror) |
| `name` | `string` | The name of the validation rule. Used to determine which rule exactly threw an error. For example required, email, etc. |
| `source?` | `Store`<`Source`\> | Optional field to which you can pass an external store if it is needed to validate the field. This store is passed to validator in the third argument |
| `validator` | [`Validator`](README.md#validator)<`Value`, `Form`, `Source`\> | A function that takes a field value, a form value and an external store. Returns boolean or [ValidationResult](README.md#validationresult) |

#### Defined in

[types.ts:39](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L39)

___

### RuleResolver

Ƭ **RuleResolver**<`Value`, `Form`\>: (`value`: `Value`, `form`: `Form`) => [`Rule`](README.md#rule)<`Value`, `Form`, `void`\>[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |
| `Form` | `any` |

#### Type declaration

▸ (`value`, `form`): [`Rule`](README.md#rule)<`Value`, `Form`, `void`\>[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Value` |
| `form` | `Form` |

##### Returns

[`Rule`](README.md#rule)<`Value`, `Form`, `void`\>[]

#### Defined in

[types.ts:120](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L120)

___

### ValidationError

Ƭ **ValidationError**<`Value`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorText?` | `string` |
| `rule` | `string` |
| `value` | `Value` |

#### Defined in

[types.ts:29](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L29)

___

### ValidationEvent

Ƭ **ValidationEvent**: ``"submit"`` \| ``"blur"`` \| ``"change"``

Trigger that will be used to validate the form or field

#### Defined in

[types.ts:8](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L8)

___

### ValidationResult

Ƭ **ValidationResult**: `Object`

See [Rule](README.md#rule)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorText?` | `string` |
| `isValid` | `boolean` |

#### Defined in

[types.ts:13](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L13)

___

### Validator

Ƭ **Validator**<`Value`, `Form`, `Source`\>: (`value`: `Value`, `form?`: `Form`, `source?`: `Source`) => `boolean` \| [`ValidationResult`](README.md#validationresult)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Form` | `any` |
| `Source` | `any` |

#### Type declaration

▸ (`value`, `form?`, `source?`): `boolean` \| [`ValidationResult`](README.md#validationresult)

A function that takes a field value, a form value
and an external store.
Returns boolean or [ValidationResult](README.md#validationresult)

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Value` |
| `form?` | `Form` |
| `source?` | `Source` |

##### Returns

`boolean` \| [`ValidationResult`](README.md#validationresult)

#### Defined in

[types.ts:23](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L23)
