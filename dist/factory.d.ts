import { Effect, Store, Domain } from "effector";
declare type UnknownObject<T = unknown> = {
    [key: string]: T;
};
export declare type Validator<Value> = (v: Value) => boolean;
export declare type Rule<Value> = {
    name: string;
    validator: Validator<Value>;
};
declare type InitFunc<Value> = () => Value;
export declare type FieldConfig<Value> = {
    init: Value | InitFunc<Value>;
    rules?: Rule<Value>[];
    validateOn?: ValidationEvent;
};
declare type ValidationEvent = "submit" | "blur" | "change";
declare type FormConfig<Fields extends UnknownObject, Done, Fail, Error> = {
    fields: Fields;
    submitFx: Effect<Done, Fail, Error>;
    domain?: Domain;
    validateOn?: ValidationEvent;
};
export declare function createFieldsStores<Fields extends UnknownObject>(fields: Fields, domain?: Domain): { [K in keyof Fields]: Fields[K] extends FieldConfig<infer U> ? Store<U> : Fields[K]; };
export declare function createForm<Fields extends UnknownObject, Done, Fail, Error>(config: FormConfig<Fields, Done, Fail, Error>): void;
export {};
