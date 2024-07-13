import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import { Provider } from "react-redux";
import { Store } from "./app/Redux";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  // </React.StrictMode>
);
