import { Store } from "effector";
import { ValidationError, Rule, AnyFields } from "./types";
export declare function createCombineValidator<Value = any, Form = any>(rules: Rule<Value, Form>[]): (value: Value, form?: Form | undefined) => ValidationError<Value>[];
export declare function eachValid(fields: AnyFields): Store<boolean>;
