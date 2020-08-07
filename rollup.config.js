import babel from "rollup-plugin-babel"
import { terser } from "rollup-plugin-terser"
import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"

export default {
    external: ["effector", "effector-react"],
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "es",
            sourcemap: true,
        },
        {
            file: pkg["umd:main"],
            format: "umd",
            sourcemap: true,
            name: "EffectorForm",
        },
        {
            file: "./dist/effector-form.iife.js",
            format: "iife",
            name: "EffectorForm",
            sourcemap: true,
        }
    ],
    plugins: [
        terser(),
        babel(),
        typescript(),
    ]
}
