import { Store } from "effector";
import { ValidationError, Rule, AnyFields, RuleResolver } from "./types";
export declare function createCombineValidator<Value = any, Form = any>(rulesOrResolver: Rule<Value, Form, any>[] | RuleResolver<Value, Form>): (value: Value, form: Form, rulesSources?: any[] | undefined) => ValidationError<Value>[];
export declare function eachValid(fields: AnyFields): Store<boolean>;
