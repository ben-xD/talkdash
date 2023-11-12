/* @refresh reload */
import { render } from "solid-js/web";

import "./css/index.css";
import "animate.css";
import App from "./App";
import { Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const root = document.getElementById("root");
if (!root) throw new Error("element with id root not found in index.html");

if (import.meta.env.DEV) {
  import("solid-devtools");
}

export const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  ),
  root,
);
