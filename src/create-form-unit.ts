import { createStore, createEvent, Domain, EventCallable, StoreWritable }
    from "effector"

type CreateStoreParams<Value> = {
    init: Value
    domain?: Domain
    existing?: StoreWritable<Value>
}

function store<Value>(
    { init, domain, existing }: CreateStoreParams<Value>,
    effectorData?: any
) {
    if (existing) {
        return existing
    }
    return domain
        ? domain.createStore(init, effectorData)
        : createStore(init, effectorData)
}

type CreateEventParams<Value> = {
    domain?: Domain
    existing?: EventCallable<Value>
}

function event<Value>({ domain, existing }: CreateEventParams<Value>) {
    if (existing) {
        return existing
    }
    return domain ? domain.createEvent<Value>() : createEvent<Value>()
}

export const createFormUnit = {
    store,
    event,
}
