import { Domain, Store, Event } from 'effector';
declare type CreateStoreParams<Value> = {
    init: Value;
    domain?: Domain;
    existing?: Store<Value>;
};
declare function store<Value>({ init, domain, existing }: CreateStoreParams<Value>): Store<Value>;
declare type CreateEventParams<Value> = {
    domain?: Domain;
    existing?: Event<Value>;
};
declare function event<Value>({ domain, existing }: CreateEventParams<Value>): Event<Value>;
export declare const createFormUnit: {
    store: typeof store;
    event: typeof event;
};
export {};
