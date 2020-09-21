import { createStore, createEvent, Domain, Store, Event } from "effector"

type CreateStoreParams<Value> = {
  init: Value
  domain?: Domain
  existing?: Store<Value>
}

function store<Value>({ init, domain, existing }: CreateStoreParams<Value>) {
    if (existing) {
        return existing
    }
    return domain ? domain.store(init) : createStore(init)
}

type CreateEventParams<Value> = {
  domain?: Domain
  existing?: Event<Value>
}

function event<Value>({ domain, existing }: CreateEventParams<Value>) {
    if (existing) {
        return existing
    }
    return domain ? domain.event<Value>() : createEvent<Value>()
}

export const createFormUnit = {
    store,
    event,
}
