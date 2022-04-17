"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("effector"),r=require("effector-react/ssr");const i={store:function({init:r,domain:i,existing:o},n){return o||(i?i.store(r,{"ɔ":n,sid:"-efg263"}):e.createStore(r,{"ɔ":n,sid:"-dyefrw"}))},event:function({domain:r,existing:i}){return i||(r?r.event({sid:"-y6riru"}):e.createEvent({sid:"-y6rhv4"}))}};function o(r,o,n,s){var t,a,d,u,l,c,m,f,v,g,h;const p="function"==typeof o.init?o.init():o.init,E=i.store({domain:n,existing:null===(t=o.units)||void 0===t?void 0:t.$value,init:p},{"ɔ":s,name:"$value",sid:"yg99i6"}),x=i.store({domain:n,existing:null===(a=o.units)||void 0===a?void 0:a.$errors,init:[]},{"ɔ":s,name:"$errors",sid:"-y2xdpq"}),b=x.map((e=>e[0]?e[0]:null)),V=E.map((e=>e!==p)),$=i.store({domain:n,existing:null===(d=o.units)||void 0===d?void 0:d.$isTouched,init:!1},{"ɔ":s,name:"$touched",sid:"sulkei"}),y=i.event({domain:n,existing:null===(u=o.units)||void 0===u?void 0:u.onChange},{name:"onChange",sid:"-bvxucw"}),w=i.event({domain:n,existing:null===(l=o.units)||void 0===l?void 0:l.onBlur},{name:"onBlur",sid:"mo0ar0"}),F=i.event({domain:n,existing:null===(c=o.units)||void 0===c?void 0:c.changed},{name:"changed",sid:"bcod8v"}),k=i.event({domain:n,existing:null===(m=o.units)||void 0===m?void 0:m.addError},{name:"addError",sid:"3cou8n"}),T=i.event({domain:n,existing:null===(f=o.units)||void 0===f?void 0:f.validate},{name:"validate",sid:"-s3sqr5"}),j=i.event({domain:n,existing:null===(v=o.units)||void 0===v?void 0:v.resetErrors},{name:"resetErrors",sid:"z8u2jo"}),S=i.event({domain:n,existing:null===(g=o.units)||void 0===g?void 0:g.resetValue},{name:"resetValue",sid:"-x0qhaf"}),D=i.event({domain:n,existing:null===(h=o.units)||void 0===h?void 0:h.reset},{name:"reset",sid:"ocz45p"}),q=b.map((e=>null===e));return{changed:F,name:r,$value:E,$errors:x,$firstError:b,$isValid:q,$isDirty:V,$isTouched:$,$touched:$,$field:e.combine({"ɔ":[{value:E,errors:x,firstError:b,isValid:q,isDirty:V,isTouched:$}],config:{name:"$field",sid:"-vj0i5c"}}),onChange:y,onBlur:w,addError:k,validate:T,set:y,reset:D,resetErrors:j,resetValue:S,filter:o.filter}}function n({$form:r,validateFormEvent:i,submitEvent:o,resetFormEvent:n,resetValues:s,field:t,rules:a,resetErrors:d,formValidationEvents:u,fieldValidationEvents:l},c){const{$value:m,$errors:f,onBlur:v,changed:g,addError:h,validate:p,resetErrors:E,resetValue:x,reset:b}=t,V="function"==typeof a?e.createStore([],{"ɔ":c,name:"rulesSources",sid:"-9d7qjb"}):e.combine({"ɔ":[a.map((({source:r})=>r||e.createStore(null,{"ɔ":c,name:"ɔ",sid:"-bexgiz"})))],config:{name:"rulesSources",sid:"-8w6454"}}),$=(y=a,(e,r,i)=>{const o=[],n="function"==typeof y?y(e,r):y;for(let s=0;s<n.length;s++){const t=n[s],a=i?i[s]:null,d=t.validator(e,r,a);"boolean"!=typeof d||d||o.push({rule:t.name,errorText:t.errorText,value:e}),"object"!=typeof d||d.isValid||o.push({rule:t.name,errorText:d.errorText,value:e})}return o});var y;const w=[...u,...l],F=[];if(w.includes("submit")){const i=e.sample({"ɔ":[{source:e.combine({"ɔ":[{fieldValue:m,form:r,rulesSources:V}],config:{name:"source",sid:"-k8128n"}}),clock:o}],config:{name:"validationTrigger",sid:"-6xbmu5"}});F.push(i)}w.includes("blur")&&F.push(e.sample({"ɔ":[{source:e.combine({"ɔ":[{fieldValue:m,form:r,rulesSources:V}],config:{name:"source",sid:"pucwwk"}}),clock:v}],config:{sid:"-m25isl"}})),w.includes("change")&&F.push(e.sample({"ɔ":[{source:e.combine({"ɔ":[{fieldValue:m,form:r,rulesSources:V}],config:{name:"source",sid:"-uicuuj"}}),clock:e.merge([g,x,s],{name:"clock",sid:"wzy69w"})}],config:{sid:"-7dr8kk"}})),F.push(e.sample({"ɔ":[{source:e.combine({"ɔ":[{fieldValue:m,form:r,rulesSources:V}],config:{name:"source",sid:"-gb07m8"}}),clock:p}],config:{sid:"6tlenr"}})),F.push(e.sample({"ɔ":[{source:e.combine({"ɔ":[{fieldValue:m,form:r,rulesSources:V}],config:{name:"source",sid:"-2kp66l"}}),clock:i}],config:{sid:"kjwg3e"}}));const k=e.sample({"ɔ":[{source:m,clock:h,fn:(e,{rule:r,errorText:i})=>({rule:r,value:e,errorText:i})}],config:{name:"addErrorWithValue",sid:"-vn5aoo"}});f.on(F,((e,{form:r,fieldValue:i,rulesSources:o})=>$(i,r,o))).on(k,((e,r)=>[r,...e])).reset(E,n,b,d),w.includes("change")||f.reset(g)}function s({$value:r,$touched:i,onChange:o,changed:n,name:s,reset:t,resetValue:a,filter:d},u,l,c,m){i.on(n,(()=>!0)).reset(t,l,c),e.guard({"ɔ":[{source:o,filter:d||(()=>!0),target:n}],config:{sid:"-ylchks"}}),r.on(n,((e,r)=>r)).on(u,((e,r)=>r.hasOwnProperty(s)?r[s]:e)).reset(t,a,m,l)}function t(e){return r.useEvent(e)}function a(e){const{value:i,errors:o,firstError:n,isValid:s,isDirty:a,isTouched:d}=r.useStore(e.$field);return{name:e.name,value:i,errors:o,firstError:n,isValid:s,isDirty:a,touched:d,isTouched:d,onChange:t(e.onChange),onBlur:t(e.onBlur),addError:t(e.addError),validate:t(e.validate),reset:t(e.reset),set:t(e.onChange),resetErrors:t(e.resetErrors),hasError:()=>null!==n,errorText:e=>n?e&&e[n.rule]?e[n.rule]:n.errorText||"":""}}exports.createForm=function(r){const{filter:t,domain:a,fields:d,validateOn:u,units:l}=r;if(!a)throw new Error("domain option is required in ssr mode!");const c={},m=[],f=[];for(const r in d){if(!d.hasOwnProperty(r))continue;const i=d[r],n=e.withFactory({sid:"tpjlm9",fn:()=>o(r,i,a,{sid:r}),name:"field",method:"createField"});c[r]=n,m.push(n.$isDirty),f.push(n.$touched)}const v=function(r){const i={};for(const e in r)r.hasOwnProperty(e)&&(i[e]=r[e].$value);return e.combine({"ɔ":[i],config:{sid:"3r0gj3"}})}(c),g=function(r){const i=[];for(const e in r){if(!r.hasOwnProperty(e))continue;const{$firstError:o}=r[e];i.push(o)}return e.combine({"ɔ":[i],config:{name:"$firstErrors",sid:"-1vosn1"}}).map((e=>e.every((e=>null===e))))}(c),h=t?e.combine({"ɔ":[g,t,(e,r)=>e&&r],config:{name:"$isFormValid",sid:"-mzafst"}}):g,p=e.combine({"ɔ":[m],config:{name:"$isDirty",sid:"-dlthzi"}}).map((e=>e.some(Boolean))),E=e.combine({"ɔ":[f],config:{name:"$touched",sid:"-tje8ud"}}).map((e=>e.some(Boolean))),x=e.combine({"ɔ":[{isValid:g,isDirty:p,touched:E}],config:{name:"$meta",sid:"2bfvkz"}}),b=i.event({domain:a,existing:null==l?void 0:l.validate},{name:"validate",sid:"yvbjh5"}),V=i.event({domain:a,existing:null==l?void 0:l.submit},{name:"submitForm",sid:"4v9jaw"}),$=i.event({domain:a,existing:null==l?void 0:l.formValidated},{name:"formValidated",sid:"q51mub"}),y=i.event({domain:a,existing:null==l?void 0:l.setForm},{name:"setForm",sid:"-myvat3"}),w=i.event({domain:a,existing:null==l?void 0:l.reset},{name:"resetForm",sid:"-khripr"}),F=i.event({domain:a,existing:null==l?void 0:l.resetValues},{name:"resetValues",sid:"ygut7h"}),k=i.event({domain:a,existing:null==l?void 0:l.resetErrors},{name:"resetErrors",sid:"-wgu0qt"}),T=i.event({domain:a,existing:null==l?void 0:l.resetTouched},{name:"resetTouched",sid:"x0xold"}),j=e.sample({"ɔ":[{source:v,clock:V}],config:{name:"submitWithFormData",sid:"-6a1prv"}}),S=e.sample({"ɔ":[{source:v,clock:b}],config:{name:"validateWithFormData",sid:"-wefxh0"}});for(const r in c){if(!c.hasOwnProperty(r))continue;const i=d[r],o=c[r];e.withFactory({sid:"oj3q0b",fn:()=>s(o,y,w,T,F),name:"none",method:"bindChangeEvent"}),i.rules&&e.withFactory({sid:"okr3se",fn:()=>n({$form:v,rules:i.rules,submitEvent:V,resetFormEvent:w,resetValues:F,resetErrors:k,validateFormEvent:b,field:o,formValidationEvents:u||["submit"],fieldValidationEvents:i.validateOn?i.validateOn:[]},{sid:r}),name:"none",method:"bindValidation"})}return e.guard({"ɔ":[{source:j,filter:h,target:$}],config:{sid:"2vvi0m"}}),e.guard({"ɔ":[{source:S,filter:h,target:$}],config:{sid:"2z69ks"}}),{fields:c,$values:v,$eachValid:g,$isValid:g,$isDirty:p,$touched:E,$meta:x,submit:V,validate:b,resetTouched:T,reset:w,resetValues:F,resetErrors:k,setForm:y,set:y,formValidated:$}},exports.useField=a,exports.useForm=function(e){const i={},o={};for(const r in e.fields){if(!e.fields.hasOwnProperty(r))continue;const n=a(e.fields[r]);i[r]=n,o[r]=n.value}const{isValid:n,isDirty:s,touched:d}=r.useStore(e.$meta);return{fields:i,values:o,hasError:e=>e?!!i[e]&&Boolean(i[e].firstError):!n,eachValid:n,isValid:n,isDirty:s,isTouched:d,touched:d,errors:e=>i[e]?i[e].errors:[],error:e=>i[e]?i[e].firstError:null,errorText:(e,r)=>{const o=i[e];return o&&o.firstError?r&&r[o.firstError.rule]?r[o.firstError.rule]:o.firstError.errorText||"":""},reset:t(e.reset),submit:t(e.submit),setForm:t(e.setForm),set:t(e.setForm),formValidated:t(e.formValidated)}};
//# sourceMappingURL=index.cjs.js.map
