import { babel } from "@rollup/plugin-babel"
import replace from "@rollup/plugin-replace"
import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

import pkg from "./package.json"
import babelConfig from "./babel.config.json"


const extensions = [".js", ".ts", ".tsx", ".jsx"]
let paths = pkg.exports["."]

const config = {
    external: [
        "effector",
        /effector\-react/
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
        {
            file: pkg["umd:main"],
            format: "umd",
            sourcemap: true,
            name: "EffectorForm",
            globals: {
                "effector": "effector",
                "effector-react": "effectorReact",
            },
        },
        {
            file: "./dist/effector-forms.iife.js",
            format: "iife",
            name: "EffectorForm",
            sourcemap: true,
            globals: {
                "effector": "effector",
                "effector-react": "effectorReact",
            },
        },
    ],
    plugins: [
        typescript({ tsconfig: "./tsconfig.json" }),
        replace({
            "preventAssignment": true,
        }),
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
            extensions,
            ...babelConfig,
        }),
        nodeResolve({ extensions }),
        commonjs({ extensions }),
        terser(),
    ]
}


export default config
