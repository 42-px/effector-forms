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
- [Form](README.md#form)
- [FormConfig](README.md#formconfig)
- [FormValues](README.md#formvalues)
- [Rule](README.md#rule)
- [ValidationError](README.md#validationerror)
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

KV from form fields

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[types.ts:122](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L122)

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

[types.ts:187](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L187)

___

### FormConfig

Ƭ **FormConfig**<`Values`\>: `Object`

Test interface annotaion

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`AnyFormValues`](README.md#anyformvalues) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain?` | `Domain` | - |
| `fields` | `FormFieldConfigs`<`Values`\> | Property annotation |
| `filter?` | `Store`<`boolean`\> | - |
| `units?` | { `addErrors?`: `Event`<`AddErrorPayload`[]\> ; `formValidated?`: `Event`<`Values`\> ; `reset?`: `Event`<`void`\> ; `resetErrors?`: `Event`<`void`\> ; `resetTouched?`: `Event`<`void`\> ; `resetValues?`: `Event`<`void`\> ; `setForm?`: `Event`<`Partial`<[`AnyFormValues`](README.md#anyformvalues)\>\> ; `setInitialForm?`: `Event`<`Partial`<[`AnyFormValues`](README.md#anyformvalues)\>\> ; `submit?`: `Event`<`void`\> ; `validate?`: `Event`<`void`\>  } | - |
| `units.addErrors?` | `Event`<`AddErrorPayload`[]\> | - |
| `units.formValidated?` | `Event`<`Values`\> | - |
| `units.reset?` | `Event`<`void`\> | - |
| `units.resetErrors?` | `Event`<`void`\> | - |
| `units.resetTouched?` | `Event`<`void`\> | - |
| `units.resetValues?` | `Event`<`void`\> | - |
| `units.setForm?` | `Event`<`Partial`<[`AnyFormValues`](README.md#anyformvalues)\>\> | - |
| `units.setInitialForm?` | `Event`<`Partial`<[`AnyFormValues`](README.md#anyformvalues)\>\> | - |
| `units.submit?` | `Event`<`void`\> | - |
| `units.validate?` | `Event`<`void`\> | - |
| `validateOn?` | `ValidationEvent`[] | - |

#### Defined in

[types.ts:149](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L149)

___

### FormValues

Ƭ **FormValues**<`Fields`\>: { [K in keyof Fields]: Fields[K] extends Field<infer U\> ? U : never }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends `AnyFields` |

#### Defined in

[types.ts:126](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L126)

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

[types.ts:24](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L24)

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

[types.ts:18](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L18)

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

[types.ts:12](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L12)
