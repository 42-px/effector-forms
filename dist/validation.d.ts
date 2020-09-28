import { Store } from "effector";
import { ValidationError, Rule, AnyFields } from "./types";
export declare function createCombineValidator<Value = any, Form = any>(rules: Rule<Value, Form, any>[]): (value: Value, form?: Form | undefined, rulesSources?: any[] | undefined) => ValidationError<Value>[];
export declare function eachValid(fields: AnyFields): Store<boolean>;
