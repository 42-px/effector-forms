/* eslint-disable react/no-render-return-value */
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"

ReactDOM.render(<App />, window.document.getElementById("root"))

if (module.hot) {
    // eslint-disable-next-line max-len
    module.hot.accept("./App", () => ReactDOM.render(<App />, document.getElementById("root")))
}
