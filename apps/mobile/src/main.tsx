import { render } from "solid-js/web";
import "uno.css";
import "./index.css";
import App from "./App";
import { applyTheme, getInitialTheme } from "./lib/theme";

applyTheme(getInitialTheme());

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

render(() => <App />, root);
