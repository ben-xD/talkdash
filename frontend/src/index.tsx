/* @refresh reload */
import { render } from "solid-js/web";

import "./css/index.css";
import "animate.css";
import App from "./App.js";
import { Router } from "@solidjs/router";

const root = document.getElementById("root");
if (!root) throw new Error("element with id root not found in index.html");

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root,
);
