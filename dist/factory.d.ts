import { Event, Store } from "effector";
import { FieldConfig, Field, AnyFieldsConfigs, FormConfig } from "./types";
declare type FormValues<Fields extends AnyFieldsConfigs> = {
    [K in keyof Fields]: Fields[K] extends FieldConfig<infer U> ? U : never;
};
declare type Form<Fields extends AnyFieldsConfigs> = {
    fields: {
        [K in keyof Fields]: Fields[K] extends FieldConfig<infer U> ? Field<U> : never;
    };
    $values: Store<FormValues<Fields>>;
    $eachValid: Store<boolean>;
    submit: Event<void>;
    setForm: Event<Partial<FormValues<Fields>>>;
    formValidated: Event<FormValues<Fields>>;
};
export declare function createForm<Fields extends AnyFieldsConfigs>(config: FormConfig<Fields>): Form<Fields>;
export {};
