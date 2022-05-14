import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter } from "react-router-dom";

import "./i18n";
const app = (
  <BrowserRouter>
    <Suspense fallback={<div>Loading ~~~~</div>}>
      <App />
    </Suspense>
  </BrowserRouter>
);
ReactDOM.render(app, document.getElementById("root"));
serviceWorker.unregister();
