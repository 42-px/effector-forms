import { Domain, Event, Store } from "effector";
import { Field, FieldConfig, AnyFormValues, ValidationEvent, Rule } from "./types";
export declare function createField(fieldName: string, fieldConfig: FieldConfig<any>, domain?: Domain): Field<any>;
declare type BindValidationParams = {
    $form: Store<AnyFormValues>;
    validateFormEvent: Event<void>;
    submitEvent: Event<void>;
    resetFormEvent: Event<void>;
    field: Field<any>;
    rules: Rule<any, any>[];
    formValidationEvents: ValidationEvent[];
    fieldValidationEvents: ValidationEvent[];
};
export declare function bindValidation({ $form, validateFormEvent, submitEvent, resetFormEvent, field, rules, formValidationEvents, fieldValidationEvents, }: BindValidationParams): void;
export declare function bindChangeEvent({ $value, $touched, onChange, changed, name, reset, filter }: Field<any>, setForm: Event<Partial<AnyFormValues>>, resetForm: Event<void>, resetTouched: Event<void>): void;
export {};
