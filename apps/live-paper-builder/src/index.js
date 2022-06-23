import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import initAuth from "./auth";
import { ContextMainProvider } from "./ContextMain";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BulkEntryWizard from "./BulkEntryWizard";

function initLoad() {
  // to avoid authentication when opening BulkEntryWizard 
  console.log(window.location.pathname);
  if (window.location.pathname === "/BulkEntryWizard") {
    renderApp(null);
  } else {
    // window.location.pathname === "/"
    initAuth(renderApp)
  }
}

function renderApp(auth) {
  console.log(auth);
  ReactDOM.render(
    <Router>
      <Routes>
        <Route exact path="/BulkEntryWizard" element={
          <React.StrictMode>
            <SnackbarProvider maxSnack={3}>
              <ContextMainProvider>
                <BulkEntryWizard/>
              </ContextMainProvider>
            </SnackbarProvider>
          </React.StrictMode>
        }/>
        <Route exact path="/" element={
          <React.StrictMode>
            <SnackbarProvider maxSnack={3}>
              <ContextMainProvider>
                <App auth={auth} />
              </ContextMainProvider>
            </SnackbarProvider>
          </React.StrictMode>
        }/>
      </Routes>
    </Router>,
    document.getElementById("root")
  );
}

window.addEventListener("DOMContentLoaded", () => initLoad());
// window.addEventListener("DOMContentLoaded", () => initAuth(renderApp));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();