import { Domain, Event, Store } from "effector";
import { Field, FieldConfig, AnyFormValues, ValidationEvent, Rule, RuleResolver } from "./types";
export declare function createField(fieldName: string, fieldConfig: FieldConfig<any>, domain?: Domain): Field<any>;
declare type BindValidationParams = {
    $form: Store<AnyFormValues>;
    validateFormEvent: Event<void>;
    submitEvent: Event<void>;
    resetFormEvent: Event<void>;
    resetValues: Event<void>;
    resetErrors: Event<void>;
    field: Field<any>;
    rules: Rule<any, any>[] | RuleResolver<any, any>;
    formValidationEvents: ValidationEvent[];
    fieldValidationEvents: ValidationEvent[];
};
export declare function bindValidation({ $form, validateFormEvent, submitEvent, resetFormEvent, resetValues, field, rules, resetErrors: resetErrorsFormEvent, formValidationEvents, fieldValidationEvents, }: BindValidationParams): void;
export declare function bindChangeEvent({ $value, $touched, onChange, changed, name, reset, resetValue, filter }: Field<any>, setForm: Event<Partial<AnyFormValues>>, resetForm: Event<void>, resetTouched: Event<void>, resetValues: Event<void>): void;
export {};
