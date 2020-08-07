"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("effector");exports.createFieldsStores=function(t,r){const o={};for(const n in t){if(!t.hasOwnProperty(n))continue;const i=t[n],c="function"==typeof i.init?i.init():i.init;o[n]=r?r.store(c):e.createStore(c)}return o},exports.createForm=function(e){};
//# sourceMappingURL=effector-form.cjs.js.map
