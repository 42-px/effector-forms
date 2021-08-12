import { babel } from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import replace from "@rollup/plugin-replace"
import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"
import babelConfig from "./babel.config.json"

const paths = pkg.exports["./ssr"]


babelConfig.plugins = [
    "@babel/plugin-proposal-optional-chaining",
    [
        "module-resolver",
        {
            "alias": {
                "@": "./src",
                "effector-react": "effector-react/ssr"
            }
        }
    ]
]

export default {
    external: [
        "effector",
        "effector-react",
        "react",
        "object-assign",
        "react-dom",
    ],
    input: "src/index.ts",
    output: [
        {
            file: paths.require,
            format: "cjs",
            sourcemap: true,
        },
        {
            file: paths.import,
            format: "es",
            sourcemap: true,
        },
    ],
    plugins: [
        typescript(),
        replace({
            "SSR_BUILD": true,
            "preventAssignment": false,
        }),
        babel({
            exclude: "node_modules/**",
            extensions: [".js", ".ts", ".tsx"],
            ...babelConfig,
        }),
        terser(),
    ]
}
