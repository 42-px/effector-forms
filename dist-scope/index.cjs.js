"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("effector"),r=require("effector-react/scope");const i={store:function({init:r,domain:i,existing:o},s){return o||(i?i.store(r,{and:s,sid:"-efg263"}):e.createStore(r,{and:s,sid:"-dyefrw"}))},event:function({domain:r,existing:i}){return i||(r?r.event({sid:"-y6riru"}):e.createEvent({sid:"-y6rhv4"}))}};function o(r,o,s){var n,t,a,d,u,l,m,c,v,f,h,g;const $="function"==typeof o.init?o.init():o.init,p=i.store({domain:s,existing:null===(n=o.units)||void 0===n?void 0:n.$value,init:$},{and:{sid:`${r}-$value`},name:"$value",sid:"yg99i6"}),x=i.store({domain:s,existing:null===(t=o.units)||void 0===t?void 0:t.$errors,init:[]},{and:{sid:`${r}-$errors`},name:"$errors",sid:"-x4u4xc"}),E=x.map((e=>e[0]?e[0]:null)),V=i.store({domain:s,existing:null===(a=o.units)||void 0===a?void 0:a.$initValue,init:$},{and:{sid:`${r}-$initValue`},name:"$initValue",sid:"xbxkbm"}),y=i.store({domain:s,existing:null===(d=o.units)||void 0===d?void 0:d.$isTouched,init:!1},{and:{sid:`${r}-$touched`},name:"$touched",sid:"-ri47cl"}),b=e.combine({and:[p,V,(e,r)=>e!==r],or:{name:"$isDirty",sid:"13u4ai"}}),T=i.event({domain:s,existing:null===(u=o.units)||void 0===u?void 0:u.onChange},{name:"onChange",sid:"47lb1q"}),F=i.event({domain:s,existing:null===(l=o.units)||void 0===l?void 0:l.onBlur},{name:"onBlur",sid:"-mbmjjf"}),k=i.event({domain:s,existing:null===(m=o.units)||void 0===m?void 0:m.changed},{name:"changed",sid:"rg7inh"}),w=i.event({domain:s,existing:null===(c=o.units)||void 0===c?void 0:c.addError},{name:"addError",sid:"te61xc"}),S=i.event({domain:s,existing:null===(v=o.units)||void 0===v?void 0:v.validate},{name:"validate",sid:"-c09lcj"}),D=i.event({domain:s,existing:null===(f=o.units)||void 0===f?void 0:f.resetErrors},{name:"resetErrors",sid:"-joqu0u"}),j=i.event({domain:s,existing:null===(h=o.units)||void 0===h?void 0:h.resetValue},{name:"resetValue",sid:"-6z99lq"}),O=i.event({domain:s,existing:null===(g=o.units)||void 0===g?void 0:g.reset},{name:"reset",sid:"-uklset"}),z=E.map((e=>null===e));return{changed:k,name:r,$initValue:V,$value:p,$errors:x,$firstError:E,$isValid:z,$isDirty:b,$isTouched:y,$touched:y,$field:e.combine({and:[{value:p,errors:x,firstError:E,isValid:z,isDirty:b,isTouched:y}],or:{name:"$field",sid:"-5hjagn"}}),onChange:T,onBlur:F,addError:w,validate:S,set:T,reset:O,resetErrors:D,resetValue:j,filter:o.filter}}function s(r,i){const{form:o,field:s,fieldConfig:n}=r,t=n.rules||[],a=o.validateOn||["submit"],d=n.validateOn||[],{$value:u,$errors:l,onBlur:m,changed:c,addError:v,validate:f,resetErrors:h,resetValue:g,reset:$}=s,p="function"==typeof t?e.createStore([],{and:{sid:`${s.name}-$rulesSources`},name:"rulesSources",sid:"-w3dsav"}):e.combine({and:[t.map((({source:r},i)=>{const o=`${s.name}-$rulesSources-${i}`;return r||e.createStore(null,{and:{sid:o},sid:"-a80zgo"})}))],or:{name:"rulesSources",sid:"-loe3ml"}}),x=(E=t,(e,r,i)=>{const o=[],s="function"==typeof E?E(e,r):E;for(let n=0;n<s.length;n++){const t=s[n],a=i?i[n]:null,d=t.validator(e,r,a);"boolean"!=typeof d||d||o.push({rule:t.name,errorText:t.errorText,value:e}),"object"!=typeof d||d.isValid||o.push({rule:t.name,errorText:d.errorText,value:e})}return o});var E;const V=[...a,...d],y=[];if(V.includes("submit")){const r=e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:p}],or:{name:"source",sid:"-uicuuj"}}),clock:o.submit}],or:{name:"validationTrigger",sid:"-u9syi1"}});y.push(r)}V.includes("blur")&&y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:p}],or:{name:"source",sid:"-5eyvy8"}}),clock:m}],or:{sid:"7roo1o"}})),V.includes("change")&&y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:p}],or:{name:"source",sid:"99fe9t"}}),clock:e.merge([c,g,o.resetValues],{name:"clock",sid:"-87bouz"})}],or:{sid:"mg2y9p"}})),y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:p}],or:{name:"source",sid:"ditz81"}}),clock:f}],or:{sid:"-ydogh4"}})),y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:p}],or:{name:"source",sid:"r950no"}}),clock:o.validate}],or:{sid:"-kndf1h"}}));const b=e.sample({and:[{source:u,clock:v,fn:(e,{rule:r,errorText:i})=>({rule:r,value:e,errorText:i})}],or:{name:"addErrorWithValue",sid:"-1tb3uf"}}),T=e.sample({and:[{source:u,clock:o.addErrors,fn:(e,r)=>({value:e,newErrors:r})}],or:{name:"addErrorsWithValue",sid:"xmpk85"}});l.on(y,((e,{form:r,fieldValue:i,rulesSources:o})=>x(i,r,o))).on(b,((e,r)=>[r,...e])).on(T,((e,{value:r,newErrors:i})=>{const o=[];for(const e of i)e.field===s.name&&o.push({value:r,rule:e.rule,errorText:e.errorText});return[...o,...e]})).reset(h,o.reset,$,o.resetErrors),V.includes("change")||l.reset(c)}function n({field:r,form:i}){const{$value:o,$initValue:s,$touched:n,onChange:t,changed:a,name:d,reset:u,resetValue:l,filter:m}=r,{setForm:c,setInitialForm:v,resetForm:f,resetTouched:h,resetValues:g}=i;n.on(a,(()=>!0)).reset(u,f,h),e.guard({and:[{source:t,filter:m||(()=>!0),target:a}],or:{sid:"-mp0rch"}}),s.on(v,((e,r)=>r.hasOwnProperty(d)?r[d]:e)),o.on(a,((e,r)=>r)).on([c,v],((e,r)=>r.hasOwnProperty(d)?r[d]:e)).reset(u,l,g,f)}function t(e){return r.useEvent(e)}function a(e){const{value:i,errors:o,firstError:s,isValid:n,isDirty:a,isTouched:d}=r.useStore(e.$field);return{name:e.name,value:i,errors:o,firstError:s,isValid:n,isDirty:a,touched:d,isTouched:d,onChange:t(e.onChange),onBlur:t(e.onBlur),addError:t(e.addError),validate:t(e.validate),reset:t(e.reset),set:t(e.onChange),resetErrors:t(e.resetErrors),hasError:()=>null!==s,errorText:e=>s?e&&e[s.rule]?e[s.rule]:s.errorText||"":""}}exports.createForm=function(r){const{filter:t,domain:a,fields:d,validateOn:u,units:l}=r,m={},c=[],v=[];for(const e in d){if(!d.hasOwnProperty(e))continue;const r=o(e,d[e],a);m[e]=r,c.push(r.$isDirty),v.push(r.$touched)}const f=function(r){const i={};for(const e in r)r.hasOwnProperty(e)&&(i[e]=r[e].$value);return e.combine({and:[i],or:{sid:"39yu4w"}})}(m),h=function(r){const i=[];for(const e in r){if(!r.hasOwnProperty(e))continue;const{$firstError:o}=r[e];i.push(o)}return e.combine({and:[i],or:{name:"$firstErrors",sid:"-1vosn1"}}).map((e=>e.every((e=>null===e))))}(m),g=t?e.combine({and:[h,t,(e,r)=>e&&r],or:{name:"$isFormValid",sid:"-ptk65z"}}):h,$=e.combine({and:[c],or:{name:"$isDirty",sid:"-qe1amr"}}).map((e=>e.some(Boolean))),p=e.combine({and:[v],or:{name:"$touched",sid:"spi0hi"}}).map((e=>e.some(Boolean))),x=e.combine({and:[{isValid:h,isDirty:$,touched:p}],or:{name:"$meta",sid:"-agrx2a"}}),E=i.event({domain:a,existing:null==l?void 0:l.validate},{name:"validate",sid:"w11t3z"}),V=i.event({domain:a,existing:null==l?void 0:l.submit},{name:"submitForm",sid:"-7wy9cd"}),y=i.event({domain:a,existing:null==l?void 0:l.formValidated},{name:"formValidated",sid:"dctu72"}),b=i.event({domain:a,existing:null==l?void 0:l.setInitialForm},{name:"setInitialForm",sid:"tgug"}),T=i.event({domain:a,existing:null==l?void 0:l.setForm},{name:"setForm",sid:"-nwyjlh"}),F=i.event({domain:a,existing:null==l?void 0:l.addErrors},{name:"addErrors",sid:"-ltujpy"}),k=i.event({domain:a,existing:null==l?void 0:l.reset},{name:"resetForm",sid:"-jjo9xd"}),w=i.event({domain:a,existing:null==l?void 0:l.resetValues},{name:"resetValues",sid:"zey1zv"}),S=i.event({domain:a,existing:null==l?void 0:l.resetErrors},{name:"resetErrors",sid:"-viqryf"}),D=i.event({domain:a,existing:null==l?void 0:l.resetTouched},{name:"resetTouched",sid:"xz0xdr"}),j=e.sample({and:[{source:f,clock:V}],or:{name:"submitWithFormData",sid:"4lzlam"}}),O=e.sample({and:[{source:f,clock:E}],or:{name:"validateWithFormData",sid:"-vgcoom"}});for(const e in m){if(!m.hasOwnProperty(e))continue;const r=d[e],i=m[e];n({form:{setForm:T,setInitialForm:b,resetForm:k,resetTouched:D,resetValues:w},field:i}),s({form:{$values:f,submit:V,reset:k,addErrors:F,resetValues:w,resetErrors:S,validate:E,validateOn:u},fieldConfig:r,field:i})}return e.guard({and:[{source:j,filter:g,target:y}],or:{sid:"3cdbtg"}}),e.guard({and:[{source:O,filter:g,target:y}],or:{sid:"3fo3dm"}}),{fields:m,$values:f,$eachValid:h,$isValid:h,$isDirty:$,$touched:p,$meta:x,submit:V,validate:E,resetTouched:D,addErrors:F,reset:k,resetValues:w,resetErrors:S,setForm:T,setInitialForm:b,set:T,formValidated:y}},exports.useField=a,exports.useForm=function(e){const i={},o={};for(const r in e.fields){if(!e.fields.hasOwnProperty(r))continue;const s=a(e.fields[r]);i[r]=s,o[r]=s.value}const{isValid:s,isDirty:n,touched:d}=r.useStore(e.$meta);return{fields:i,values:o,hasError:e=>e?!!i[e]&&Boolean(i[e].firstError):!s,eachValid:s,isValid:s,isDirty:n,isTouched:d,touched:d,errors:e=>i[e]?i[e].errors:[],error:e=>i[e]?i[e].firstError:null,errorText:(e,r)=>{const o=i[e];return o&&o.firstError?r&&r[o.firstError.rule]?r[o.firstError.rule]:o.firstError.errorText||"":""},reset:t(e.reset),submit:t(e.submit),setForm:t(e.setForm),set:t(e.setForm),formValidated:t(e.formValidated)}};
//# sourceMappingURL=index.cjs.js.map
