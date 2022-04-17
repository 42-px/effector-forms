(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('effector'), require('effector-react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'effector', 'effector-react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EffectorForm = {}, global.effector, global.effectorReact));
})(this, (function (exports, effector, effectorReact) { 'use strict';

    function createCombineValidator(rulesOrResolver) {
      return (value, form, rulesSources) => {
        const errors = [];
        const rules = typeof rulesOrResolver === "function" ? rulesOrResolver(value, form) : rulesOrResolver;

        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          const source = rulesSources ? rulesSources[i] : null;
          const result = rule.validator(value, form, source);

          if (typeof result === "boolean" && !result) {
            errors.push({
              rule: rule.name,
              errorText: rule.errorText,
              value
            });
          }

          if (typeof result === "object" && !result.isValid) {
            errors.push({
              rule: rule.name,
              errorText: result.errorText,
              value
            });
          }
        }

        return errors;
      };
    }
    function eachValid(fields) {
      const firstErrors = [];

      for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue;
        const {
          $firstError
        } = fields[fieldName];
        firstErrors.push($firstError);
      }

      const $firstErrors = effector.combine({
        and: [firstErrors],
        or: {
          name: "$firstErrors",
          sid: "-1vosn1"
        }
      });
      return $firstErrors.map(errors => errors.every(error => error === null));
    }

    function store({
      init,
      domain,
      existing
    }, effectorData) {
      if (existing) {
        return existing;
      }

      return domain ? domain.store(init, {
        and: effectorData,
        sid: "-efg263"
      }) : effector.createStore(init, {
        and: effectorData,
        sid: "-dyefrw"
      });
    }

    function event({
      domain,
      existing
    }) {
      if (existing) {
        return existing;
      }

      return domain ? domain.event({
        sid: "-y6riru"
      }) : effector.createEvent({
        sid: "-y6rhv4"
      });
    }

    const createFormUnit = {
      store,
      event
    };

    function createField(fieldName, fieldConfig, domain, effectorData) {
      var _fieldConfig$units, _fieldConfig$units2, _fieldConfig$units3, _fieldConfig$units4, _fieldConfig$units5, _fieldConfig$units6, _fieldConfig$units7, _fieldConfig$units8, _fieldConfig$units9, _fieldConfig$units10, _fieldConfig$units11;

      const initValue = typeof fieldConfig.init === "function" ? fieldConfig.init() : fieldConfig.init;
      const $value = createFormUnit.store({
        domain,
        existing: (_fieldConfig$units = fieldConfig.units) === null || _fieldConfig$units === void 0 ? void 0 : _fieldConfig$units.$value,
        init: initValue
      }, {
        and: effectorData,
        name: "$value",
        sid: "yg99i6"
      });
      const $errors = createFormUnit.store({
        domain,
        existing: (_fieldConfig$units2 = fieldConfig.units) === null || _fieldConfig$units2 === void 0 ? void 0 : _fieldConfig$units2.$errors,
        init: []
      }, {
        and: effectorData,
        name: "$errors",
        sid: "-y2xdpq"
      });
      const $firstError = $errors.map(errors => errors[0] ? errors[0] : null);
      const $isDirty = $value.map(value => value !== initValue);
      const $touched = createFormUnit.store({
        domain,
        existing: (_fieldConfig$units3 = fieldConfig.units) === null || _fieldConfig$units3 === void 0 ? void 0 : _fieldConfig$units3.$isTouched,
        init: false
      }, {
        and: effectorData,
        name: "$touched",
        sid: "sulkei"
      });
      const onChange = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units4 = fieldConfig.units) === null || _fieldConfig$units4 === void 0 ? void 0 : _fieldConfig$units4.onChange
      }, {
        name: "onChange",
        sid: "-bvxucw"
      });
      const onBlur = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units5 = fieldConfig.units) === null || _fieldConfig$units5 === void 0 ? void 0 : _fieldConfig$units5.onBlur
      }, {
        name: "onBlur",
        sid: "mo0ar0"
      });
      const changed = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units6 = fieldConfig.units) === null || _fieldConfig$units6 === void 0 ? void 0 : _fieldConfig$units6.changed
      }, {
        name: "changed",
        sid: "bcod8v"
      });
      const addError = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units7 = fieldConfig.units) === null || _fieldConfig$units7 === void 0 ? void 0 : _fieldConfig$units7.addError
      }, {
        name: "addError",
        sid: "3cou8n"
      });
      const validate = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units8 = fieldConfig.units) === null || _fieldConfig$units8 === void 0 ? void 0 : _fieldConfig$units8.validate
      }, {
        name: "validate",
        sid: "-s3sqr5"
      });
      const resetErrors = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units9 = fieldConfig.units) === null || _fieldConfig$units9 === void 0 ? void 0 : _fieldConfig$units9.resetErrors
      }, {
        name: "resetErrors",
        sid: "z8u2jo"
      });
      const resetValue = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units10 = fieldConfig.units) === null || _fieldConfig$units10 === void 0 ? void 0 : _fieldConfig$units10.resetValue
      }, {
        name: "resetValue",
        sid: "-x0qhaf"
      });
      const reset = createFormUnit.event({
        domain,
        existing: (_fieldConfig$units11 = fieldConfig.units) === null || _fieldConfig$units11 === void 0 ? void 0 : _fieldConfig$units11.reset
      }, {
        name: "reset",
        sid: "ocz45p"
      });
      const $isValid = $firstError.map(firstError => firstError === null);
      const $field = effector.combine({
        and: [{
          value: $value,
          errors: $errors,
          firstError: $firstError,
          isValid: $isValid,
          isDirty: $isDirty,
          isTouched: $touched
        }],
        or: {
          name: "$field",
          sid: "-vj0i5c"
        }
      });
      return {
        changed,
        name: fieldName,
        $value,
        $errors,
        $firstError,
        $isValid,
        $isDirty,
        $isTouched: $touched,
        $touched,
        $field: $field,
        onChange,
        onBlur,
        addError,
        validate,
        set: onChange,
        reset,
        resetErrors,
        resetValue,
        filter: fieldConfig.filter
      };
    }
    function bindValidation({
      $form,
      validateFormEvent,
      submitEvent,
      resetFormEvent,
      resetValues,
      field,
      rules,
      resetErrors: resetErrorsFormEvent,
      formValidationEvents,
      fieldValidationEvents
    }, effectorData) {
      const {
        $value,
        $errors,
        onBlur,
        changed,
        addError,
        validate,
        resetErrors,
        resetValue,
        reset
      } = field;
      const rulesSources = typeof rules === "function" ? effector.createStore([], {
        and: effectorData,
        name: "rulesSources",
        sid: "-9d7qjb"
      }) : effector.combine({
        and: [rules.map(({
          source
        }) => source || effector.createStore(null, {
          and: effectorData,
          name: "and",
          sid: "5j6y42"
        }))],
        or: {
          name: "rulesSources",
          sid: "-8w6454"
        }
      });
      const validator = createCombineValidator(rules);
      const eventsNames = [...formValidationEvents, ...fieldValidationEvents];
      const validationEvents = [];

      if (eventsNames.includes("submit")) {
        const validationTrigger = effector.sample({
          and: [{
            source: effector.combine({
              and: [{
                fieldValue: $value,
                form: $form,
                rulesSources
              }],
              or: {
                name: "source",
                sid: "-k8128n"
              }
            }),
            clock: submitEvent
          }],
          or: {
            name: "validationTrigger",
            sid: "-6xbmu5"
          }
        });
        validationEvents.push(validationTrigger);
      }

      if (eventsNames.includes("blur")) {
        validationEvents.push(effector.sample({
          and: [{
            source: effector.combine({
              and: [{
                fieldValue: $value,
                form: $form,
                rulesSources
              }],
              or: {
                name: "source",
                sid: "pucwwk"
              }
            }),
            clock: onBlur
          }],
          or: {
            sid: "-m25isl"
          }
        }));
      }

      if (eventsNames.includes("change")) {
        validationEvents.push(effector.sample({
          and: [{
            source: effector.combine({
              and: [{
                fieldValue: $value,
                form: $form,
                rulesSources
              }],
              or: {
                name: "source",
                sid: "-uicuuj"
              }
            }),
            clock: effector.merge([changed, resetValue, resetValues], {
              name: "clock",
              sid: "wzy69w"
            })
          }],
          or: {
            sid: "-7dr8kk"
          }
        }));
      }

      validationEvents.push(effector.sample({
        and: [{
          source: effector.combine({
            and: [{
              fieldValue: $value,
              form: $form,
              rulesSources
            }],
            or: {
              name: "source",
              sid: "-gb07m8"
            }
          }),
          clock: validate
        }],
        or: {
          sid: "6tlenr"
        }
      }));
      validationEvents.push(effector.sample({
        and: [{
          source: effector.combine({
            and: [{
              fieldValue: $value,
              form: $form,
              rulesSources
            }],
            or: {
              name: "source",
              sid: "-2kp66l"
            }
          }),
          clock: validateFormEvent
        }],
        or: {
          sid: "kjwg3e"
        }
      }));
      const addErrorWithValue = effector.sample({
        and: [{
          source: $value,
          clock: addError,
          fn: (value, {
            rule,
            errorText
          }) => ({
            rule,
            value,
            errorText
          })
        }],
        or: {
          name: "addErrorWithValue",
          sid: "-vn5aoo"
        }
      });
      $errors.on(validationEvents, (_, {
        form,
        fieldValue,
        rulesSources
      }) => validator(fieldValue, form, rulesSources)).on(addErrorWithValue, (errors, newError) => [newError, ...errors]).reset(resetErrors, resetFormEvent, reset, resetErrorsFormEvent);

      if (!eventsNames.includes("change")) {
        $errors.reset(changed);
      }
    }
    function bindChangeEvent({
      $value,
      $touched,
      onChange,
      changed,
      name,
      reset,
      resetValue,
      filter
    }, setForm, resetForm, resetTouched, resetValues) {
      $touched.on(changed, () => true).reset(reset, resetForm, resetTouched);
      effector.guard({
        and: [{
          source: onChange,
          filter: filter || (() => true),
          target: changed
        }],
        or: {
          sid: "-ylchks"
        }
      });
      $value.on(changed, (_, value) => value).on(setForm, (curr, updateSet) => updateSet.hasOwnProperty(name) ? updateSet[name] : curr).reset(reset, resetValue, resetValues, resetForm);
    }

    function createFormValuesStore(fields) {
      const shape = {};

      for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue;
        shape[fieldName] = fields[fieldName].$value;
      }

      return effector.combine({
        and: [shape],
        or: {
          sid: "39yu4w"
        }
      });
    }

    function createForm(config) {
      const {
        filter: $filter,
        domain,
        fields: fieldsConfigs,
        validateOn,
        units
      } = config;
      const fields = {};
      const dirtyFlagsArr = [];
      const touchedFlagsArr = []; // create units

      for (const fieldName in fieldsConfigs) {
        if (!fieldsConfigs.hasOwnProperty(fieldName)) continue;
        const fieldConfig = fieldsConfigs[fieldName];

        const field = effector.withFactory({
          sid: "rtd41h",
          fn: () => createField(fieldName, fieldConfig, domain, {
            sid: fieldName
          }),
          name: "field",
          method: "createField"
        });

        fields[fieldName] = field;
        dirtyFlagsArr.push(field.$isDirty);
        touchedFlagsArr.push(field.$touched);
      }

      const $form = createFormValuesStore(fields);
      const $eachValid = eachValid(fields);
      const $isFormValid = $filter ? effector.combine({
        and: [$eachValid, $filter, (valid, filter) => valid && filter],
        or: {
          name: "$isFormValid",
          sid: "-ovgxdl"
        }
      }) : $eachValid;
      const $isDirty = effector.combine({
        and: [dirtyFlagsArr],
        or: {
          name: "$isDirty",
          sid: "-pfy1ud"
        }
      }).map(dirtyFlags => dirtyFlags.some(Boolean));
      const $touched = effector.combine({
        and: [touchedFlagsArr],
        or: {
          name: "$touched",
          sid: "tnl99w"
        }
      }).map(touchedFlags => touchedFlags.some(Boolean));
      const $meta = effector.combine({
        and: [{
          isValid: $eachValid,
          isDirty: $isDirty,
          touched: $touched
        }],
        or: {
          name: "$meta",
          sid: "-9ioo9w"
        }
      });
      const validate = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.validate
      }, {
        name: "validate",
        sid: "wz51wd"
      });
      const submitForm = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.submit
      }, {
        name: "submitForm",
        sid: "-6yv0jz"
      });
      const formValidated = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.formValidated
      }, {
        name: "formValidated",
        sid: "o8v59j"
      });
      const setForm = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.setForm
      }, {
        name: "setForm",
        sid: "-ov1sdv"
      });
      const resetForm = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.reset
      }, {
        name: "resetForm",
        sid: "-wbw2km"
      });
      const resetValues = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.resetValues
      }, {
        name: "resetValues",
        sid: "wkobmp"
      });
      const resetErrors = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.resetErrors
      }, {
        name: "resetErrors",
        sid: "qq5hdg"
      });
      const resetTouched = createFormUnit.event({
        domain,
        existing: units === null || units === void 0 ? void 0 : units.resetTouched
      }, {
        name: "resetTouched",
        sid: "v4r70l"
      });
      const submitWithFormData = effector.sample({
        and: [{
          source: $form,
          clock: submitForm
        }],
        or: {
          name: "submitWithFormData",
          sid: "-8687cn"
        }
      });
      const validateWithFormData = effector.sample({
        and: [{
          source: $form,
          clock: validate
        }],
        or: {
          name: "validateWithFormData",
          sid: "qsjkn9"
        }
      }); // bind units

      for (const fieldName in fields) {
        if (!fields.hasOwnProperty(fieldName)) continue;
        const fieldConfig = fieldsConfigs[fieldName];
        const field = fields[fieldName];

        effector.withFactory({
          sid: "o5cv6a",
          fn: () => bindChangeEvent(field, setForm, resetForm, resetTouched, resetValues),
          name: "none",
          method: "bindChangeEvent"
        });

        if (!fieldConfig.rules) continue;

        effector.withFactory({
          sid: "oijxey",
          fn: () => bindValidation({
            $form,
            rules: fieldConfig.rules,
            submitEvent: submitForm,
            resetFormEvent: resetForm,
            resetValues,
            resetErrors,
            validateFormEvent: validate,
            field,
            formValidationEvents: validateOn ? validateOn : ["submit"],
            fieldValidationEvents: fieldConfig.validateOn ? fieldConfig.validateOn : []
          }, {
            sid: fieldName
          }),
          name: "none",
          method: "bindValidation"
        });
      }

      effector.guard({
        and: [{
          source: submitWithFormData,
          filter: $isFormValid,
          // TODO: fix
          target: formValidated
        }],
        or: {
          sid: "2i4n6l"
        }
      });
      effector.guard({
        and: [{
          source: validateWithFormData,
          filter: $isFormValid,
          target: formValidated
        }],
        or: {
          sid: "2wz37c"
        }
      });
      return {
        fields,
        $values: $form,
        $eachValid,
        $isValid: $eachValid,
        $isDirty: $isDirty,
        $touched: $touched,
        $meta,
        submit: submitForm,
        validate,
        resetTouched,
        reset: resetForm,
        resetValues,
        resetErrors,
        setForm,
        set: setForm,
        formValidated
      };
    }

    function wrapEvent(event) {
      return event;
    }

    function useField(field) {
      const {
        value,
        errors,
        firstError,
        isValid,
        isDirty,
        isTouched: touched
      } = effectorReact.useStore(field.$field);
      return {
        name: field.name,
        value,
        errors,
        firstError,
        isValid,
        isDirty,
        touched,
        isTouched: touched,
        onChange: wrapEvent(field.onChange),
        onBlur: wrapEvent(field.onBlur),
        addError: wrapEvent(field.addError),
        validate: wrapEvent(field.validate),
        reset: wrapEvent(field.reset),
        set: wrapEvent(field.onChange),
        resetErrors: wrapEvent(field.resetErrors),
        hasError: () => {
          return firstError !== null;
        },
        errorText: map => {
          if (!firstError) {
            return "";
          }

          if (!map) {
            return firstError.errorText || "";
          }

          if (map[firstError.rule]) {
            return map[firstError.rule];
          }

          return firstError.errorText || "";
        }
      };
    }
    function useForm(form) {
      const connectedFields = {};
      const values = {};

      for (const fieldName in form.fields) {
        if (!form.fields.hasOwnProperty(fieldName)) continue;
        const field = form.fields[fieldName];
        const connectedField = useField(field);
        connectedFields[fieldName] = connectedField;
        values[fieldName] = connectedField.value;
      }

      const {
        isValid: eachValid,
        isDirty,
        touched
      } = effectorReact.useStore(form.$meta);

      const hasError = fieldName => {
        if (!fieldName) {
          return !eachValid;
        }

        if (connectedFields[fieldName]) {
          return Boolean(connectedFields[fieldName].firstError);
        }

        return false;
      };

      const error = fieldName => {
        if (connectedFields[fieldName]) {
          return connectedFields[fieldName].firstError;
        }

        return null;
      };

      const errors = fieldName => {
        if (connectedFields[fieldName]) {
          return connectedFields[fieldName].errors;
        }

        return [];
      };

      const errorText = (fieldName, map) => {
        const field = connectedFields[fieldName];

        if (!field) {
          return "";
        }

        if (!field.firstError) {
          return "";
        }

        if (!map) {
          return field.firstError.errorText || "";
        }

        if (map[field.firstError.rule]) {
          return map[field.firstError.rule];
        }

        return field.firstError.errorText || "";
      };

      return {
        fields: connectedFields,
        values,
        hasError,
        eachValid,
        isValid: eachValid,
        isDirty,
        isTouched: touched,
        touched,
        errors,
        error,
        errorText,
        reset: wrapEvent(form.reset),
        submit: wrapEvent(form.submit),
        setForm: wrapEvent(form.setForm),
        set: wrapEvent(form.setForm),
        formValidated: wrapEvent(form.formValidated)
      };
    }

    exports.createForm = createForm;
    exports.useField = useField;
    exports.useForm = useForm;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=effector-forms.umd.js.map
