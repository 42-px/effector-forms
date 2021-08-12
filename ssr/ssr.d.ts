import { Event } from "effector";
export declare function isSSR(): boolean;
export declare function wrapEvent<P>(event: Event<P>): (payload: P) => P;
