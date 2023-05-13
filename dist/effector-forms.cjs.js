"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("effector"),r=require("effector-react");const i={store:function({init:r,domain:i,existing:o},s){return o||(i?i.store(r,{and:s,sid:"-efg263"}):e.createStore(r,{and:s,sid:"-dyefrw"}))},event:function({domain:r,existing:i}){return i||(r?r.event({sid:"-y6riru"}):e.createEvent({sid:"-y6rhv4"}))}};function o(r,o,s,n){var t,a,d,u,l,m,c,v,f,h,g,$;const x="function"==typeof o.init?o.init():o.init,p=i.store({domain:s,existing:null===(t=o.units)||void 0===t?void 0:t.$value,init:x},{and:{sid:`${r}-$value`},name:"$value",sid:"yg99i6"}),V=i.store({domain:s,existing:null===(a=o.units)||void 0===a?void 0:a.$errors,init:[]},{and:{sid:`${r}-$errors`},name:"$errors",sid:"-x4u4xc"}),E=V.map((e=>e[0]?e[0]:null)),y=i.store({domain:s,existing:null===(d=o.units)||void 0===d?void 0:d.$initValue,init:x},{and:{sid:`${r}-$initValue`},name:"$initValue",sid:"xbxkbm"}),b=i.store({domain:s,existing:null===(u=o.units)||void 0===u?void 0:u.$isTouched,init:!1},{and:{sid:`${r}-$touched`},name:"$touched",sid:"-ri47cl"}),T=e.combine({and:[p,y,(e,r)=>e!==r],or:{name:"$isDirty",sid:"13u4ai"}}),F=i.event({domain:s,existing:null===(l=o.units)||void 0===l?void 0:l.onChange},{name:"onChange",sid:"47lb1q"}),k=i.event({domain:s,existing:null===(m=o.units)||void 0===m?void 0:m.onBlur},{name:"onBlur",sid:"-mbmjjf"}),w=i.event({domain:s,existing:null===(c=o.units)||void 0===c?void 0:c.changed},{name:"changed",sid:"rg7inh"}),S=i.event({domain:s,existing:null===(v=o.units)||void 0===v?void 0:v.addError},{name:"addError",sid:"te61xc"}),D=i.event({domain:s,existing:null===(f=o.units)||void 0===f?void 0:f.validate},{name:"validate",sid:"-c09lcj"}),O=i.event({domain:s,existing:null===(h=o.units)||void 0===h?void 0:h.resetErrors},{name:"resetErrors",sid:"-joqu0u"}),j=i.event({domain:s,existing:null===(g=o.units)||void 0===g?void 0:g.resetValue},{name:"resetValue",sid:"-6z99lq"}),B=i.event({domain:s,existing:null===($=o.units)||void 0===$?void 0:$.reset},{name:"reset",sid:"-uklset"}),C=E.map((e=>null===e));return{changed:w,name:r,$initValue:y,$value:p,$errors:V,$firstError:E,$isValid:C,$isDirty:T,$isTouched:b,$touched:b,$field:e.combine({and:[{value:p,errors:V,firstError:E,isValid:C,isDirty:T,isTouched:b}],or:{name:"$field",sid:"-5hjagn"}}),onChange:F,onBlur:k,addError:S,validate:D,set:F,reset:B,resetErrors:O,resetValue:j,filter:o.filter}}function s(r,i){const{form:o,field:s,fieldConfig:n}=r,t=n.rules||[],a=o.validateOn||["submit"],d=n.validateOn||[],{$value:u,$errors:l,onBlur:m,changed:c,addError:v,validate:f,resetErrors:h,resetValue:g,reset:$}=s,x="function"==typeof t?e.createStore([],{and:{sid:`${s.name}-$rulesSources`},name:"rulesSources",sid:"-w3dsav"}):e.combine({and:[t.map((({source:r},i)=>{const o=`${s.name}-$rulesSources-${i}`;return r||e.createStore(null,{and:{sid:o},sid:"-a80zgo"})}))],or:{name:"rulesSources",sid:"-loe3ml"}}),p=(V=t,(e,r,i)=>{const o=[],s="function"==typeof V?V(e,r):V;for(let n=0;n<s.length;n++){const t=s[n],a=i?i[n]:null,d=t.validator(e,r,a);"boolean"!=typeof d||d||o.push({rule:t.name,errorText:t.errorText,value:e}),"object"!=typeof d||d.isValid||o.push({rule:t.name,errorText:d.errorText,value:e})}return o});var V;const E=[...a,...d],y=[];if(E.includes("submit")){const r=e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:x}],or:{name:"source",sid:"-uicuuj"}}),clock:o.submit}],or:{name:"validationTrigger",sid:"-u9syi1"}});y.push(r)}E.includes("blur")&&y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:x}],or:{name:"source",sid:"-5eyvy8"}}),clock:m}],or:{sid:"7roo1o"}})),E.includes("change")&&y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:x}],or:{name:"source",sid:"99fe9t"}}),clock:e.merge([c,g,o.resetValues],{name:"clock",sid:"-87bouz"})}],or:{sid:"mg2y9p"}})),y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:x}],or:{name:"source",sid:"ditz81"}}),clock:f}],or:{sid:"-ydogh4"}})),y.push(e.sample({and:[{source:e.combine({and:[{fieldValue:u,form:o.$values,rulesSources:x}],or:{name:"source",sid:"r950no"}}),clock:o.validate}],or:{sid:"-kndf1h"}}));const b=e.sample({and:[{source:u,clock:v,fn:(e,{rule:r,errorText:i})=>({rule:r,value:e,errorText:i})}],or:{name:"addErrorWithValue",sid:"-1tb3uf"}}),T=e.sample({and:[{source:u,clock:o.addErrors,fn:(e,r)=>({value:e,newErrors:r})}],or:{name:"addErrorsWithValue",sid:"xmpk85"}});l.on(y,((e,{form:r,fieldValue:i,rulesSources:o})=>p(i,r,o))).on(b,((e,r)=>[r,...e])).on(T,((e,{value:r,newErrors:i})=>{const o=[];for(const e of i)e.field===s.name&&o.push({value:r,rule:e.rule,errorText:e.errorText});return[...o,...e]})).reset(h,o.reset,$,o.resetErrors),E.includes("change")||l.reset(c)}function n({field:r,form:i}){const{$value:o,$initValue:s,$touched:n,onChange:t,changed:a,name:d,reset:u,resetValue:l,filter:m}=r,{setForm:c,setInitialForm:v,resetForm:f,resetTouched:h,resetValues:g}=i;n.on(a,(()=>!0)).reset(u,f,h),e.guard({and:[{source:t,filter:m||(()=>!0),target:a}],or:{sid:"-mp0rch"}}),s.on(v,((e,r)=>r.hasOwnProperty(d)?r[d]:e)),o.on(a,((e,r)=>r)).on([c,v],((e,r)=>r.hasOwnProperty(d)?r[d]:e)).reset(u,l,g,f)}function t(e){const{value:i,errors:o,firstError:s,isValid:n,isDirty:t,isTouched:a}=r.useStore(e.$field);return{name:e.name,value:i,errors:o,firstError:s,isValid:n,isDirty:t,touched:a,isTouched:a,onChange:e.onChange,onBlur:e.onBlur,addError:e.addError,validate:e.validate,reset:e.reset,set:e.onChange,resetErrors:e.resetErrors,hasError:()=>null!==s,errorText:e=>s?e&&e[s.rule]?e[s.rule]:s.errorText||"":""}}exports.createForm=function(r){const{filter:t,domain:a,fields:d,validateOn:u,units:l}=r,m={},c=[],v=[];for(const e in d){if(!d.hasOwnProperty(e))continue;const r=o(e,d[e],a);m[e]=r,c.push(r.$isDirty),v.push(r.$touched)}const f=function(r){const i={};for(const e in r)r.hasOwnProperty(e)&&(i[e]=r[e].$value);return e.combine({and:[i],or:{sid:"39yu4w"}})}(m),h=function(r){const i=[];for(const e in r){if(!r.hasOwnProperty(e))continue;const{$firstError:o}=r[e];i.push(o)}return e.combine({and:[i],or:{name:"$firstErrors",sid:"-1vosn1"}}).map((e=>e.every((e=>null===e))))}(m),g=t?e.combine({and:[h,t,(e,r)=>e&&r],or:{name:"$isFormValid",sid:"-ovgxdl"}}):h,$=e.combine({and:[c],or:{name:"$isDirty",sid:"-pfy1ud"}}).map((e=>e.some(Boolean))),x=e.combine({and:[v],or:{name:"$touched",sid:"tnl99w"}}).map((e=>e.some(Boolean))),p=e.combine({and:[{isValid:h,isDirty:$,touched:x}],or:{name:"$meta",sid:"-9ioo9w"}}),V=i.event({domain:a,existing:null==l?void 0:l.validate},{name:"validate",sid:"wz51wd"}),E=i.event({domain:a,existing:null==l?void 0:l.submit},{name:"submitForm",sid:"-6yv0jz"}),y=i.event({domain:a,existing:null==l?void 0:l.formValidated},{name:"formValidated",sid:"o8v59j"}),b=i.event({domain:a,existing:null==l?void 0:l.setInitialForm},{name:"setInitialForm",sid:"ywpmu"}),T=i.event({domain:a,existing:null==l?void 0:l.setForm},{name:"setForm",sid:"-myvat3"}),F=i.event({domain:a,existing:null==l?void 0:l.addErrors},{name:"addErrors",sid:"-kvraxk"}),k=i.event({domain:a,existing:null==l?void 0:l.reset},{name:"resetForm",sid:"-ill14z"}),w=i.event({domain:a,existing:null==l?void 0:l.resetValues},{name:"resetValues",sid:"-oq4ows"}),S=i.event({domain:a,existing:null==l?void 0:l.resetErrors},{name:"resetErrors",sid:"-uknj61"}),D=i.event({domain:a,existing:null==l?void 0:l.resetTouched},{name:"resetTouched",sid:"yx4665"}),O=e.sample({and:[{source:f,clock:E}],or:{name:"submitWithFormData",sid:"5k2u30"}}),j=e.sample({and:[{source:f,clock:V}],or:{name:"validateWithFormData",sid:"-ui9fw8"}});for(const e in m){if(!m.hasOwnProperty(e))continue;const r=d[e],i=m[e];n({form:{setForm:T,setInitialForm:b,resetForm:k,resetTouched:D,resetValues:w},field:i}),s({form:{$values:f,submit:E,reset:k,addErrors:F,resetValues:w,resetErrors:S,validate:V,validateOn:u},fieldConfig:r,field:i})}return e.guard({and:[{source:O,filter:g,target:y}],or:{sid:"3dgx06"}}),e.guard({and:[{source:j,filter:g,target:y}],or:{sid:"3grokc"}}),{fields:m,$values:f,$eachValid:h,$isValid:h,$isDirty:$,$touched:x,$meta:p,submit:E,validate:V,resetTouched:D,addErrors:F,reset:k,resetValues:w,resetErrors:S,setForm:T,setInitialForm:b,set:T,formValidated:y}},exports.useField=t,exports.useForm=function(e){const i={},o={};for(const r in e.fields){if(!e.fields.hasOwnProperty(r))continue;const s=t(e.fields[r]);i[r]=s,o[r]=s.value}const{isValid:s,isDirty:n,touched:a}=r.useStore(e.$meta);return{fields:i,values:o,hasError:e=>e?!!i[e]&&Boolean(i[e].firstError):!s,eachValid:s,isValid:s,isDirty:n,isTouched:a,touched:a,errors:e=>i[e]?i[e].errors:[],error:e=>i[e]?i[e].firstError:null,errorText:(e,r)=>{const o=i[e];return o&&o.firstError?r&&r[o.firstError.rule]?r[o.firstError.rule]:o.firstError.errorText||"":""},reset:e.reset,submit:e.submit,setForm:e.setForm,set:e.setForm,formValidated:e.formValidated}};
//# sourceMappingURL=effector-forms.cjs.js.map
