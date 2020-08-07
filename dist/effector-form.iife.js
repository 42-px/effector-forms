var EffectorForm=function(t,n){"use strict";return t.createFieldsStores=function(t,e){const r={};for(const o in t){if(!t.hasOwnProperty(o))continue;const i=t[o],c="function"==typeof i.init?i.init():i.init;r[o]=e?e.store(c):n.createStore(c)}return r},t.createForm=function(t){},t}({},effector);
//# sourceMappingURL=effector-form.iife.js.map
