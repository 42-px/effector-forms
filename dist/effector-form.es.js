import{createStore as n}from"effector";function t(t,o){const i={};for(const r in t){if(!t.hasOwnProperty(r))continue;const f=t[r],c="function"==typeof f.init?f.init():f.init;i[r]=o?o.store(c):n(c)}return i}function o(n){}export{t as createFieldsStores,o as createForm};
//# sourceMappingURL=effector-form.es.js.map
