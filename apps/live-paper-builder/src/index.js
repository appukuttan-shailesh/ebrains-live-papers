import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import initAuth from "./auth";
import { ContextMainProvider } from "./ContextMain";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import BulkEntryWizard from "./BulkEntryWizard";


const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#00A595",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
});


function initLoad() {
  // to avoid authentication when opening BulkEntryWizard
  console.log(window.location.pathname);
  if (window.location.pathname.includes("BulkEntryWizard")) {
    renderApp(null);
  } else {
    initAuth(renderApp);
  }
}

function renderApp(auth) {
  console.log(auth);
  ReactDOM.render(
    <Router>
      <Routes>
        {["/BulkEntryWizard", "/builder/BulkEntryWizard"].map((path, index) => {
          return (
            <Route
              path={path}
              element={
                <React.StrictMode>
                  <ThemeProvider theme={theme}>
                    <SnackbarProvider maxSnack={3}>
                      <ContextMainProvider>
                        <BulkEntryWizard />
                      </ContextMainProvider>
                    </SnackbarProvider>
                  </ThemeProvider>
                </React.StrictMode>
              }
              key={index}
            />
          );
        })}
        {["/", "/builder/", "*"].map((path, index) => {
          return (
            <Route
              path={path}
              element={
                <React.StrictMode>
                  <ThemeProvider theme={theme}>
                    <SnackbarProvider maxSnack={3}>
                      <ContextMainProvider>
                        <App auth={auth} />
                      </ContextMainProvider>
                    </SnackbarProvider>
                  </ThemeProvider>
                </React.StrictMode>
              }
              key={index}
            />
          );
        })}
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
