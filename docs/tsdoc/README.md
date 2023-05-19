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
- [ExternalFormUnits](README.md#externalformunits)
- [FieldConfig](README.md#fieldconfig)
- [Form](README.md#form)
- [FormConfig](README.md#formconfig)
- [FormValues](README.md#formvalues)
- [Rule](README.md#rule)
- [RuleResolver](README.md#ruleresolver)
- [ValidationError](README.md#validationerror)
- [ValidationEvent](README.md#validationevent)
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

[types.ts:135](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L135)

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

[types.ts:165](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L165)

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
| `filter?` | `Store`<`boolean`\> \| `FilterFunc`<`Value`\> | - |
| `init` | `Value` \| `InitFieldValue`<`Value`\> | initial value. The type of this value is used to infer the type of the field. You can pass a function that returns an initial value. This function will be called once when the form is created |
| `rules?` | [`Rule`](README.md#rule)<`Value`\>[] \| [`RuleResolver`](README.md#ruleresolver)<`Value`, `any`\> | - |
| `units?` | { `$errors?`: `Store`<[`ValidationError`](README.md#validationerror)<`Value`\>[]\> ; `$initValue?`: `Store`<`Value`\> ; `$isTouched?`: `Store`<`boolean`\> ; `$value?`: `Store`<`Value`\> ; `addError?`: `Event`<{ `errorText?`: `string` ; `rule`: `string`  }\> ; `changed?`: `Event`<`Value`\> ; `onBlur?`: `Event`<`void`\> ; `onChange?`: `Event`<`Value`\> ; `reset?`: `Event`<`void`\> ; `resetErrors?`: `Event`<`void`\> ; `resetValue?`: `Event`<`void`\> ; `validate?`: `Event`<`void`\>  } | - |
| `units.$errors?` | `Store`<[`ValidationError`](README.md#validationerror)<`Value`\>[]\> | - |
| `units.$initValue?` | `Store`<`Value`\> | - |
| `units.$isTouched?` | `Store`<`boolean`\> | - |
| `units.$value?` | `Store`<`Value`\> | - |
| `units.addError?` | `Event`<{ `errorText?`: `string` ; `rule`: `string`  }\> | - |
| `units.changed?` | `Event`<`Value`\> | - |
| `units.onBlur?` | `Event`<`void`\> | - |
| `units.onChange?` | `Event`<`Value`\> | - |
| `units.reset?` | `Event`<`void`\> | - |
| `units.resetErrors?` | `Event`<`void`\> | - |
| `units.resetValue?` | `Event`<`void`\> | - |
| `units.validate?` | `Event`<`void`\> | - |
| `validateOn?` | [`ValidationEvent`](README.md#validationevent)[] | - |

#### Defined in

[types.ts:97](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L97)

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

[types.ts:224](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L224)

___

### FormConfig

Ƭ **FormConfig**<`Values`\>: `Object`

The object that is passed to the [createForm](README.md#createform) factory

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

[types.ts:182](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L182)

___

### FormValues

Ƭ **FormValues**<`Fields`\>: { [K in keyof Fields]: Fields[K] extends Field<infer U\> ? U : never }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends `AnyFields` |

#### Defined in

[types.ts:139](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L139)

___

### Rule

Ƭ **Rule**<`Value`, `Form`, `Source`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Form` | `any` |
| `Source` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorText?` | `string` |
| `name` | `string` |
| `source?` | `Store`<`Source`\> |
| `validator` | [`Validator`](README.md#validator)<`Value`, `Form`, `Source`\> |

#### Defined in

[types.ts:27](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L27)

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

[types.ts:88](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L88)

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

[types.ts:21](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L21)

___

### ValidationEvent

Ƭ **ValidationEvent**: ``"submit"`` \| ``"blur"`` \| ``"change"``

Trigger that will be used to validate the form or field

#### Defined in

[types.ts:8](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L8)

___

### Validator

Ƭ **Validator**<`Value`, `Form`, `Source`\>: (`value`: `Value`, `form?`: `Form`, `source?`: `Source`) => `boolean` \| `ValidationResult`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Form` | `any` |
| `Source` | `any` |

#### Type declaration

▸ (`value`, `form?`, `source?`): `boolean` \| `ValidationResult`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Value` |
| `form?` | `Form` |
| `source?` | `Source` |

##### Returns

`boolean` \| `ValidationResult`

#### Defined in

[types.ts:15](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L15)
