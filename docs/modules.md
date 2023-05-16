[effector-forms](README.md) / Exports

# effector-forms

## Table of contents

### Type Aliases

- [Form](modules.md#form)
- [FormConfig](modules.md#formconfig)
- [FormValues](modules.md#formvalues)
- [Rule](modules.md#rule)
- [ValidationError](modules.md#validationerror)
- [Validator](modules.md#validator)

### Functions

- [createForm](modules.md#createform)
- [useField](modules.md#usefield)
- [useForm](modules.md#useform)

## Type Aliases

### Form

Ƭ **Form**<`Values`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends `AnyFormValues` |

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

[types.ts:184](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L184)

___

### FormConfig

Ƭ **FormConfig**<`Values`\>: `Object`

Test interface annotaion

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends `AnyFormValues` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain?` | `Domain` | - |
| `fields` | `FormFieldConfigs`<`Values`\> | Property annotation |
| `filter?` | `Store`<`boolean`\> | - |
| `units?` | { `addErrors?`: `Event`<`AddErrorPayload`[]\> ; `formValidated?`: `Event`<`Values`\> ; `reset?`: `Event`<`void`\> ; `resetErrors?`: `Event`<`void`\> ; `resetTouched?`: `Event`<`void`\> ; `resetValues?`: `Event`<`void`\> ; `setForm?`: `Event`<`Partial`<`AnyFormValues`\>\> ; `setInitialForm?`: `Event`<`Partial`<`AnyFormValues`\>\> ; `submit?`: `Event`<`void`\> ; `validate?`: `Event`<`void`\>  } | - |
| `units.addErrors?` | `Event`<`AddErrorPayload`[]\> | - |
| `units.formValidated?` | `Event`<`Values`\> | - |
| `units.reset?` | `Event`<`void`\> | - |
| `units.resetErrors?` | `Event`<`void`\> | - |
| `units.resetTouched?` | `Event`<`void`\> | - |
| `units.resetValues?` | `Event`<`void`\> | - |
| `units.setForm?` | `Event`<`Partial`<`AnyFormValues`\>\> | - |
| `units.setInitialForm?` | `Event`<`Partial`<`AnyFormValues`\>\> | - |
| `units.submit?` | `Event`<`void`\> | - |
| `units.validate?` | `Event`<`void`\> | - |
| `validateOn?` | `ValidationEvent`[] | - |

#### Defined in

[types.ts:146](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L146)

___

### FormValues

Ƭ **FormValues**<`Fields`\>: { [K in keyof Fields]: Fields[K] extends Field<infer U\> ? U : never }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends `AnyFields` |

#### Defined in

[types.ts:123](https://github.com/42-px/effector-forms/blob/5028150/src/types.ts#L123)

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
| `validator` | [`Validator`](modules.md#validator)<`Value`, `Form`, `Source`\> |

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

## Functions

### createForm

▸ **createForm**<`Values`\>(`config`): [`Form`](modules.md#form)<`Values`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends `AnyFormValues` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`FormConfig`](modules.md#formconfig)<`Values`\> |

#### Returns

[`Form`](modules.md#form)<`Values`\>

#### Defined in

[factory.ts:38](https://github.com/42-px/effector-forms/blob/5028150/src/factory.ts#L38)

___

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

[react-hooks.ts:43](https://github.com/42-px/effector-forms/blob/5028150/src/react-hooks.ts#L43)

___

### useForm

▸ **useForm**<`Values`\>(`form`): `Result`<`Values`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends `AnyFormValues` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `form` | [`Form`](modules.md#form)<`Values`\> |

#### Returns

`Result`<`Values`\>

#### Defined in

[react-hooks.ts:111](https://github.com/42-px/effector-forms/blob/5028150/src/react-hooks.ts#L111)
