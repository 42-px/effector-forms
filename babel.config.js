module.exports = api => {
    const isTest = api.env("test")

    const typescript = isTest ? [
        "@babel/preset-typescript"
    ] : []

    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    modules: false,
                }
            ],
            ...typescript,
        ],
        "plugins": [
            [
                "module-resolver",
                {
                    alias: {
                        "@": "./src"
                    }
                }
            ]
        ]
    }
}
