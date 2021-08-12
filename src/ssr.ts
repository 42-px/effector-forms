import { Event } from "effector"
import { useEvent } from "effector-react"

export function isSSR() {
    return SSR_BUILD === true
}

export function wrapEvent<P>(event: Event<P>) {
    return isSSR() ? useEvent(event) : event
}


