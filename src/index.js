import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { userAgent } from "./utils/tools";
import EventEmitter from "events";
const root = ReactDOM.createRoot(document.getElementById("root"));

const App = React.lazy(() => import("./App"));
const WapApp = React.lazy(() => import("./wap/App"));

window.eventBus = new EventEmitter();
root.render(
  <BrowserRouter basename="/">
    <React.Suspense fallback={<img src={require("./wap/assets/image/common/loading.gif")} alt="" className="loadingPng" />}>{userAgent() === "PC" ? <App /> : <WapApp />}</React.Suspense>
  </BrowserRouter>
);

reportWebVitals();
