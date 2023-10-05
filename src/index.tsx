import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import { loginAction } from "./store/modules/user";
import parseJwt from "./libs/parseJwt";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
if (localStorage.accessToken && localStorage.accessToken !== "undefined ") {
  store.dispatch(
    loginAction({
      accountId: parseJwt(localStorage.accessToken).accountId,
      memberName: parseJwt(localStorage.accessToken).memberName,
      iat: parseJwt(localStorage.accessToken).iat,
      exp: parseJwt(localStorage.accessToken).exp,
    })
  );
}
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
