import { Event } from "effector"
import { useEvent } from "effector-react"

export function isScope() {
    return process.env.IS_SCOPE_BUILD === "true"
}

export function wrapEvent<P>(event: Event<P>) {
    return isScope() ? useEvent(event) : event
}


