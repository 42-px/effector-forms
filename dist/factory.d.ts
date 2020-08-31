import { Event, Store } from "effector";
import { FieldConfig, Field, AnyFieldsConfigs, FormConfig } from "./types";
export declare type FormValues<Fields extends AnyFieldsConfigs> = {
    [K in keyof Fields]: Fields[K] extends FieldConfig<infer U> ? U : never;
};
export declare type Form<Fields extends AnyFieldsConfigs> = {
    fields: {
        [K in keyof Fields]: Fields[K] extends FieldConfig<infer U> ? Field<U> : never;
    };
    $values: Store<FormValues<Fields>>;
    $eachValid: Store<boolean>;
    $isValid: Store<boolean>;
    $isDirty: Store<boolean>;
    $touched: Store<boolean>;
    submit: Event<void>;
    reset: Event<void>;
    set: Event<Partial<FormValues<Fields>>>;
    setForm: Event<Partial<FormValues<Fields>>>;
    resetTouched: Event<void>;
    formValidated: Event<FormValues<Fields>>;
};
export declare function createForm<Fields extends AnyFieldsConfigs>(config: FormConfig<Fields>): Form<Fields>;
