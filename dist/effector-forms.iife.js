var EffectorForm=function(e,r,i){"use strict";const s={store:function({init:e,domain:i,existing:s},o){return s||(i?i.createStore(e,{and:o,sid:"-efg263"}):r.createStore(e,{and:o,sid:"-dyefrw"}))},event:function({domain:e,existing:i}){return i||(e?e.createEvent({sid:"-y6riru"}):r.createEvent({sid:"-y6rh7v"}))}};function o(e,i,o){var n,t,a,d,u,l,c,m,v,f,h,g;const $="function"==typeof i.init?i.init():i.init,p=s.store({domain:o,existing:null===(n=i.units)||void 0===n?void 0:n.$value,init:$},{and:{sid:`${e}-$value`},name:"$value",sid:"-qmuyz8"}),V=s.store({domain:o,existing:null===(t=i.units)||void 0===t?void 0:t.$errors,init:[]},{and:{sid:`${e}-$errors`},name:"$errors",sid:"-vpp9qr"}),E=V.map((e=>e[0]?e[0]:null)),x=s.store({domain:o,existing:null===(a=i.units)||void 0===a?void 0:a.$initValue,init:$},{and:{sid:`${e}-$initValue`},name:"$initValue",sid:"yr2fi7"}),y=s.store({domain:o,existing:null===(d=i.units)||void 0===d?void 0:d.$isTouched,init:!1},{and:{sid:`${e}-$touched`},name:"$touched",sid:"-q2zc60"}),b=r.combine({and:[p,x,(e,r)=>e!==r],or:{name:"$isDirty",sid:"cgx1r6"}}),T=s.event({domain:o,existing:null===(u=i.units)||void 0===u?void 0:u.onChange},{name:"onChange",sid:"fko8ie"}),F=s.event({domain:o,existing:null===(l=i.units)||void 0===l?void 0:l.onBlur},{name:"onBlur",sid:"-kwhocu"}),k=s.event({domain:o,existing:null===(c=i.units)||void 0===c?void 0:c.changed},{name:"changed",sid:"svcdu2"}),w=s.event({domain:o,existing:null===(m=i.units)||void 0===m?void 0:m.addError},{name:"addError",sid:"utax3x"}),S=s.event({domain:o,existing:null===(v=i.units)||void 0===v?void 0:v.validate},{name:"validate",sid:"-al4q5y"}),j=s.event({domain:o,existing:null===(f=i.units)||void 0===f?void 0:f.resetErrors},{name:"resetErrors",sid:"-8bnwk6"}),D=s.event({domain:o,existing:null===(h=i.units)||void 0===h?void 0:h.resetValue},{name:"resetValue",sid:"-5k4ef5"}),U=s.event({domain:o,existing:null===(g=i.units)||void 0===g?void 0:g.reset},{name:"reset",sid:"-t5gx88"}),q=E.map((e=>null===e)),O=E.map((e=>(null==e?void 0:e.errorText)||"")),B=r.combine({and:[{value:p,errors:V,firstError:E,isValid:q,isDirty:b,isTouched:y}],or:{name:"$field",sid:"-3lcsvv"}}),C={value:p,initValue:x,isValid:q,isDirty:b,touched:y,errors:V,firstError:E,errorText:O,onChange:T,onBlur:F,addError:w,validate:S,reset:U,resetErrors:j,resetValue:D};return{changed:k,name:e,$initValue:x,$value:p,$errors:V,$firstError:E,$errorText:O,$isValid:q,$isDirty:b,$isTouched:y,$touched:y,$field:B,onChange:T,onBlur:F,addError:w,validate:S,set:T,reset:U,resetErrors:j,resetValue:D,filter:i.filter,"@@unitShape":()=>C}}function n(e,i){const{form:s,field:o,fieldConfig:n}=e,t=n.rules||[],a=s.validateOn||["submit"],d=n.validateOn||[],{$value:u,$errors:l,onBlur:c,changed:m,addError:v,validate:f,resetErrors:h,resetValue:g,reset:$}=o,p="function"==typeof t?r.createStore([],{and:{sid:`${o.name}-$rulesSources`},name:"rulesSources",sid:"8mhplv"}):r.combine({and:[t.map((({source:e},i)=>{const s=`${o.name}-$rulesSources-${i}`;return e||r.createStore(null,{and:{sid:s},sid:"kjwg5z"})}))],or:{name:"rulesSources",sid:"93jc02"}}),V=(E=t,(e,r,i)=>{const s=[],o="function"==typeof E?E(e,r):E;for(let n=0;n<o.length;n++){const t=o[n],a=i?i[n]:null,d=t.validator(e,r,a);"boolean"!=typeof d||d||s.push({rule:t.name,errorText:t.errorText,value:e}),"object"!=typeof d||d.isValid||s.push({rule:t.name,errorText:d.errorText,value:e})}return s});var E;const x=[...a,...d],y=[];if(x.includes("submit")){const e=r.sample({and:[{source:r.combine({and:[{fieldValue:u,form:s.$values,rulesSources:p}],or:{name:"source",sid:"a7in27"}}),clock:s.submit}],or:{name:"validationTrigger",sid:"ag2jep"}});y.push(e)}x.includes("blur")&&y.push(r.sample({and:[{source:r.combine({and:[{fieldValue:u,form:s.$values,rulesSources:p}],or:{name:"source",sid:"pcyjof"}}),clock:c}],or:{sid:"-mjjw0q"}})),x.includes("change")&&y.push(r.sample({and:[{source:r.combine({and:[{fieldValue:u,form:s.$values,rulesSources:p}],or:{name:"source",sid:"-uzr82o"}}),clock:r.merge([m,g,s.resetValues],{name:"clock",sid:"mklqro"})}],or:{sid:"-7v5lsp"}})),y.push(r.sample({and:[{source:r.combine({and:[{fieldValue:u,form:s.$values,rulesSources:p}],or:{name:"source",sid:"-gsekud"}}),clock:f}],or:{sid:"6c71fm"}})),y.push(r.sample({and:[{source:r.combine({and:[{fieldValue:u,form:s.$values,rulesSources:p}],or:{name:"source",sid:"-323jeq"}}),clock:s.validate}],or:{sid:"a4k0l6"}}));const b=r.sample({and:[{source:u,clock:v,fn:(e,{rule:r,errorText:i})=>({rule:r,value:e,errorText:i})}],or:{name:"addErrorWithValue",sid:"symbs8"}}),T=r.sample({and:[{source:u,clock:s.addErrors,fn:(e,r)=>({value:e,newErrors:r})}],or:{name:"addErrorsWithValue",sid:"-6mh24c"}});l.on(y,((e,{form:r,fieldValue:i,rulesSources:s})=>V(i,r,s))).on(b,((e,r)=>[r,...e])).on(T,((e,{value:r,newErrors:i})=>{const s=[];for(const e of i)e.field===o.name&&s.push({value:r,rule:e.rule,errorText:e.errorText});return[...s,...e]})).reset(h,s.reset,$,s.resetErrors),x.includes("change")||l.reset(m)}function t({field:e,form:i}){const{$value:s,$initValue:o,$touched:n,onChange:t,changed:a,name:d,reset:u,resetValue:l,filter:c}=e,{setForm:m,setInitialForm:v,resetForm:f,resetTouched:h,resetValues:g}=i,$=r.sample({and:[{source:o,clock:r.merge([u,l,g,f],{name:"clock",sid:"3kodws"})}],or:{name:"resetValueWithInit",sid:"oge6qb"}});n.on(a,(()=>!0)).reset(u,f,h),r.guard({and:[{source:t,filter:c||(()=>!0),target:a}],or:{sid:"-kx8mil"}}),o.on(v,((e,r)=>r.hasOwnProperty(d)?r[d]:e)),s.on(a,((e,r)=>r)).on([m,v],((e,r)=>r.hasOwnProperty(d)?r[d]:e)).on($,((e,r)=>r))}function a(e){const{value:r,errors:s,firstError:o,isValid:n,isDirty:t,isTouched:a}=i.useUnit(e.$field);return{name:e.name,value:r,errors:s,firstError:o,isValid:n,isDirty:t,touched:a,isTouched:a,onChange:i.useUnit(e.onChange),onBlur:i.useUnit(e.onBlur),addError:i.useUnit(e.addError),validate:i.useUnit(e.validate),reset:i.useUnit(e.reset),set:i.useUnit(e.onChange),resetErrors:i.useUnit(e.resetErrors),hasError:()=>null!==o,errorText:e=>o?e&&e[o.rule]?e[o.rule]:o.errorText||"":""}}return e.createForm=function(e){const{filter:i,domain:a,fields:d,validateOn:u,units:l}=e,c={},m=[],v=[];for(const e in d){if(!d.hasOwnProperty(e))continue;const r=o(e,d[e],a);c[e]=r,m.push(r.$isDirty),v.push(r.$touched)}const f=function(e){const i={};for(const r in e)e.hasOwnProperty(r)&&(i[r]=e[r].$value);return r.combine({and:[i],or:{sid:"39yu4w"}})}(c),h=function(e){const i=[];for(const r in e){if(!e.hasOwnProperty(r))continue;const{$firstError:s}=e[r];i.push(s)}return r.combine({and:[i],or:{name:"$firstErrors",sid:"-1vosn1"}}).map((e=>e.every((e=>null===e))))}(c),g=i?r.combine({and:[h,i,(e,r)=>e&&r],or:{name:"$isFormValid",sid:"j5pxai"}}):h,$=r.combine({and:[m],or:{name:"$isDirty",sid:"il8stq"}}).map((e=>e.some(Boolean))),p=r.combine({and:[v],or:{name:"$touched",sid:"2no1yv"}}).map((e=>e.some(Boolean))),V=r.combine({and:[{isValid:h,isDirty:$,touched:p}],or:{name:"$meta",sid:"yii6e7"}}),E=s.event({domain:a,existing:null==l?void 0:l.validate},{name:"validate",sid:"5z7ulc"}),x=s.event({domain:a,existing:null==l?void 0:l.submit},{name:"submitForm",sid:"-xys7v0"}),y=s.event({domain:a,existing:null==l?void 0:l.formValidated},{name:"formValidated",sid:"-2r221i"}),b=s.event({domain:a,existing:null==l?void 0:l.setInitialForm},{name:"setInitialForm",sid:"-q10ho7"}),T=s.event({domain:a,existing:null==l?void 0:l.setForm},{name:"setForm",sid:"l2bjv0"}),F=s.event({domain:a,existing:null==l?void 0:l.addErrors},{name:"addErrors",sid:"n5fjqj"}),k=s.event({domain:a,existing:null==l?void 0:l.reset},{name:"resetForm",sid:"pfltj4"}),w=s.event({domain:a,existing:null==l?void 0:l.resetValues},{name:"resetValues",sid:"-s67s76"}),S=s.event({domain:a,existing:null==l?void 0:l.resetErrors},{name:"resetErrors",sid:"hulqf7"}),j=s.event({domain:a,existing:null==l?void 0:l.resetTouched},{name:"resetTouched",sid:"2gwck3"}),D=r.sample({and:[{source:f,clock:x}],or:{name:"submitWithFormData",sid:"foyubg"}}),U=r.sample({and:[{source:f,clock:E}],or:{name:"validateWithFormData",sid:"-mn7k5o"}});for(const e in c){if(!c.hasOwnProperty(e))continue;const r=d[e],i=c[e];t({form:{setForm:T,setInitialForm:b,resetForm:k,resetTouched:j,resetValues:w},field:i}),n({form:{$values:f,submit:x,reset:k,addErrors:F,resetValues:w,resetErrors:S,validate:E,validateOn:u},fieldConfig:r,field:i})}r.guard({and:[{source:D,filter:g,target:y}],or:{sid:"4sls6r"}}),r.guard({and:[{source:U,filter:g,target:y}],or:{sid:"4vwjqx"}});const q={isValid:h,isDirty:$,touched:p,submit:x,reset:k,addErrors:F,validate:E,setForm:T,setInitialForm:b,resetTouched:j,resetValues:w,resetErrors:S,formValidated:y};return{fields:c,$values:f,$eachValid:h,$isValid:h,$isDirty:$,$touched:p,$meta:V,submit:x,validate:E,resetTouched:j,addErrors:F,reset:k,resetValues:w,resetErrors:S,setForm:T,setInitialForm:b,set:T,formValidated:y,"@@unitShape":()=>q}},e.useField=a,e.useForm=function(e){const r={},s={};for(const i in e.fields){if(!e.fields.hasOwnProperty(i))continue;const o=a(e.fields[i]);r[i]=o,s[i]=o.value}const{isValid:o,isDirty:n,touched:t}=i.useUnit(e.$meta);return{fields:r,values:s,hasError:e=>e?!!r[e]&&Boolean(r[e].firstError):!o,eachValid:o,isValid:o,isDirty:n,isTouched:t,touched:t,errors:e=>r[e]?r[e].errors:[],error:e=>r[e]?r[e].firstError:null,errorText:(e,i)=>{const s=r[e];return s&&s.firstError?i&&i[s.firstError.rule]?i[s.firstError.rule]:s.firstError.errorText||"":""},reset:i.useUnit(e.reset),submit:i.useUnit(e.submit),setForm:i.useUnit(e.setForm),set:i.useUnit(e.setForm),formValidated:i.useUnit(e.formValidated)}},Object.defineProperty(e,"__esModule",{value:!0}),e}({},effector,effectorReact);
//# sourceMappingURL=effector-forms.iife.js.map
