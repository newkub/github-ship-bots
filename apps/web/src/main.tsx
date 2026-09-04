import { render } from "solid-js/web";
import "uno.css";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

const stored = localStorage.getItem("ship-feed-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (stored === "dark" || (!stored && prefersDark)) {
  document.documentElement.classList.add("dark");
}

render(() => <App />, root);
