import { createCombineValidator, eachValid } from "./validation"
import { createField } from "./field"
import { Rule, AnyFields } from "./types"

test("create combine validator", () => {
    const rules: Rule<string>[] = [
        {
            name: "required",
            validator: (value) => Boolean(value)
        },  
        {
            name: "minLength",
            validator: (value) => value.length >= 3
        },
        {
            name: "maxLength",
            validator: (value) => ({
                isValid: value.length <= 30,
                errorText: "value must be less than 30 characters",
            }),
        },
        {
            name: "email",
            validator: (value) => /\S+@\S+\.\S+/.test(value)
        },
    ]

    const validate = createCombineValidator(rules)

    expect(validate("")).toEqual([
        {
            rule: "required",
            value: "",
        },
        {
            rule: "minLength",
            value: "",
        },
        {
            rule: "email",
            value: "",
        },
    ])

    expect(validate("12")).toEqual([
        {
            rule: "minLength",
            value: "12",
        },
        {
            rule: "email",
            value: "12",
        },
    ])

    expect(validate("email@example.com")).toEqual([])

    
    const longEmail = "loooooooooooooooooooooooooooooooooooongemail@example.com"
    // eslint-disable-next-line max-len
    expect(validate(longEmail)).toEqual([
        {
            rule: "maxLength",
            value: longEmail,
            errorText: "value must be less than 30 characters",
        },
    ])
})

test("each valid", () => {
    const fields: AnyFields = {
        username: createField("username", {
            init: "",
            rules: [
                {
                    name: "required",
                    validator: (value) => Boolean(value)
                }, 
            ],
        }),
        password: createField("password", {
            init: "",
            rules: [
                {
                    name: "required",
                    validator: (value) => Boolean(value)
                },
                {
                    name: "minLength",
                    validator: (value) => value.length >= 3
                },
            ],
        })
    }

    const $eachValid = eachValid(fields)

    expect($eachValid.getState()).toEqual(true)
})
