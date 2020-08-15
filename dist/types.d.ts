import { Event, Store, Domain } from "effector";
declare type InitFieldValue<Value> = () => Value;
export declare type ValidationEvent = "submit" | "blur" | "change";
export declare type ValidationResult = {
    isValid: boolean;
    errorText?: string;
};
export declare type Validator<Value, Form = any> = (value: Value, form?: Form) => boolean | ValidationResult;
export declare type ValidationError<Value = any> = {
    rule: string;
    value: Value;
    errorText?: string;
};
export declare type Rule<Value, Form = any> = {
    name: string;
    validator: Validator<Value, Form>;
};
export declare type Field<Value> = {
    name: string;
    $value: Store<Value>;
    $errors: Store<ValidationError<Value>[]>;
    $firstError: Store<ValidationError<Value> | null>;
    onChange: Event<Value>;
    onBlur: Event<void>;
    addError: Event<{
        rule: string;
        errorText?: string;
    }>;
    validate: Event<void>;
    resetErrors: Event<void>;
};
export declare type FieldConfig<Value> = {
    init: Value | InitFieldValue<Value>;
    rules?: Rule<Value>[];
    validateOn?: ValidationEvent[];
};
export declare type AnyFields = {
    [key: string]: Field<any>;
};
export declare type AnyFieldsConfigs = {
    [key: string]: FieldConfig<any>;
};
export declare type AnyFormValues = {
    [key: string]: any;
};
export declare type FormConfig<Fields extends AnyFieldsConfigs> = {
    fields: Fields;
    domain?: Domain;
    filter?: Store<boolean>;
    validateOn?: ValidationEvent[];
};
export {};
