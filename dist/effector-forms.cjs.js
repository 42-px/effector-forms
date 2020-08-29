"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("effector"),r=require("effector-react");function t(r,t,o){const n="function"==typeof t.init?t.init():t.init,s=o?o.store(n):e.createStore(n),a=o?o.store([]):e.createStore([]),i=a.map(e=>e[0]?e[0]:null),l=o?o.event():e.createEvent(),u=o?o.event():e.createEvent(),c=o?o.event():e.createEvent(),f=o?o.event():e.createEvent(),d=o?o.event():e.createEvent(),v=o?o.event():e.createEvent();return{name:r,$value:s,$errors:a,$firstError:i,$isValid:i.map(e=>null===e),onChange:l,onBlur:u,addError:c,validate:f,set:l,reset:v,resetErrors:d}}function o({$form:r,submitEvent:t,field:o,rules:n,formValidationEvents:s,fieldValidationEvents:a}){const{$value:i,$errors:l,onBlur:u,onChange:c,addError:f,validate:d,resetErrors:v}=o,m=function(e){return(r,t)=>{const o=[];for(const n of e){const e=n.validator(r,t);"boolean"!=typeof e||e||o.push({rule:n.name,value:r}),"object"!=typeof e||e.isValid||o.push({rule:n.name,errorText:e.errorText,value:r})}return o}}(n),E=[...s,...a],p=[];E.includes("submit")&&p.push(e.sample({source:e.combine({fieldValue:i,form:r}),clock:t})),E.includes("blur")&&p.push(e.sample({source:e.combine({fieldValue:i,form:r}),clock:u})),E.includes("change")&&p.push(e.sample({source:e.combine({fieldValue:i,form:r}),clock:c})),p.push(e.sample({source:e.combine({fieldValue:i,form:r}),clock:d}));const h=e.sample({source:i,clock:f,fn:(e,{rule:r,errorText:t})=>({rule:r,value:e,errorText:t})});l.on(p,(e,{form:r,fieldValue:t})=>m(t,r)).on(h,(e,r)=>[r,...e]).reset(v),E.includes("change")||l.reset(c)}function n({$value:e,onChange:r,name:t,reset:o},n,s){e.on(r,(e,r)=>r).on(n,(e,r)=>r.hasOwnProperty(t)?r[t]:e).reset(o,s)}function s(e){const t=r.useStore(e.$value),o=r.useStore(e.$errors),n=r.useStore(e.$firstError),s=r.useStore(e.$isValid);return{name:e.name,value:t,errors:o,firstError:n,isValid:s,onChange:e.onChange,onBlur:e.onBlur,addError:e.addError,validate:e.validate,reset:e.reset,set:e.onChange,resetErrors:e.resetErrors,hasError:()=>null!==n,errorText:e=>n?e&&e[n.rule]?e[n.rule]:n.errorText||"":""}}exports.createForm=function(r){const{filter:s,domain:a,fields:i,validateOn:l}=r,u={};for(const e in i){if(!i.hasOwnProperty(e))continue;const r=i[e];u[e]=t(e,r,a)}const c=function(r){const t={};for(const e in r)r.hasOwnProperty(e)&&(t[e]=r[e].$value);return e.combine(t)}(u),f=function(r){const t=[];for(const e in r){if(!r.hasOwnProperty(e))continue;const{$firstError:o}=r[e];t.push(o)}return e.combine(t).map(e=>e.every(e=>null===e))}(u),d=s?e.combine(f,s,(e,r)=>e&&r):f,v=a?a.event():e.createEvent(),m=a?a.event():e.createEvent(),E=a?a.event():e.createEvent(),p=a?a.event():e.createEvent(),h=e.sample(c,v);for(const e in u){if(!u.hasOwnProperty(e))continue;const r=i[e],t=u[e];n(t,E,p),r.rules&&o({$form:c,rules:r.rules,submitEvent:v,field:t,formValidationEvents:l||["submit"],fieldValidationEvents:r.validateOn?r.validateOn:[]})}return e.guard({source:h,filter:d,target:m}),{fields:u,$values:c,$eachValid:f,$isValid:f,submit:v,reset:p,setForm:E,set:E,formValidated:m}},exports.useField=s,exports.useForm=function(e){const t={};for(const r in e.fields){if(!e.fields.hasOwnProperty(r))continue;const o=e.fields[r];t[r]=s(o)}const o=r.useStore(e.$values),n=r.useStore(e.$eachValid);return{fields:t,values:o,hasError:e=>e?!!t[e]&&Boolean(t[e].firstError):!n,eachValid:n,isValid:n,errors:e=>t[e]?t[e].errors:[],error:e=>t[e]?t[e].firstError:null,reset:e.reset,errorText:(e,r)=>{const o=t[e];return o&&o.firstError?r&&r[o.firstError.rule]?r[o.firstError.rule]:o.firstError.errorText||"":""},submit:e.submit,setForm:e.setForm,set:e.setForm,formValidated:e.formValidated}};
//# sourceMappingURL=effector-forms.cjs.js.map